const crypto = require('crypto');
const { pool, query } = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const rows = await query(
    `SELECT o.*, u.full_name, u.email 
     FROM orders o 
     LEFT JOIN users u ON o.user_id = u.id 
     ORDER BY o.created_at DESC`
  );

  const orders = rows.map(r => ({
    id: r.id,
    user_id: r.user_id,
    status: r.status,
    total_amount: r.total_amount,
    created_at: r.created_at,
    updated_at: r.updated_at,
    users: r.user_id ? {
      id: r.user_id,
      email: r.email,
      full_name: r.full_name
    } : null
  }));

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const orders = await query(
    `SELECT o.*, u.full_name, u.email 
     FROM orders o 
     LEFT JOIN users u ON o.user_id = u.id 
     WHERE o.id = ?`,
    [req.params.id]
  );

  if (!orders || orders.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

  const order = orders[0];
  order.users = order.user_id ? {
    id: order.user_id,
    email: order.email,
    full_name: order.full_name
  } : null;

  const itemRows = await query(
    `SELECT oi.*, v.name, v.price AS vehicle_price, v.image_url 
     FROM order_items oi 
     LEFT JOIN vehicles v ON oi.vehicle_id = v.id 
     WHERE oi.order_id = ?`,
    [req.params.id]
  );

  order.order_items = itemRows.map(i => ({
    id: i.id,
    order_id: i.order_id,
    vehicle_id: i.vehicle_id,
    quantity: i.quantity,
    price: i.price,
    created_at: i.created_at,
    vehicles: i.vehicle_id ? {
      id: i.vehicle_id,
      name: i.name,
      price: i.vehicle_price,
      image_url: i.image_url
    } : null
  }));

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Please provide status', 400));
  }

  await query(
    'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
    [status, req.params.id]
  );

  const updatedOrders = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

  if (!updatedOrders || updatedOrders.length === 0) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order: updatedOrders[0] }
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First delete order items
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);

    // Then delete the order
    const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return next(new AppError('No order found with that ID', 404));
    }

    await connection.commit();
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    await connection.rollback();
    return next(new AppError(err.message, 500));
  } finally {
    connection.release();
  }
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch user's cart items
    const [cartItems] = await connection.query(
      `SELECT c.*, v.price, v.stock 
       FROM cart c 
       JOIN vehicles v ON c.vehicle_id = v.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems || cartItems.length === 0) {
      await connection.rollback();
      return next(new AppError('Cart is empty', 400));
    }

    // 2. Calculate total amount
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.quantity * Number(item.price)), 0);

    // 3. Create order
    const orderId = crypto.randomUUID();
    await connection.query(
      'INSERT INTO orders (id, user_id, status, total_amount) VALUES (?, ?, ?, ?)',
      [orderId, userId, 'pending', totalAmount]
    );

    // 4. Create order items & deduct stock
    for (const item of cartItems) {
      const orderItemId = crypto.randomUUID();
      await connection.query(
        'INSERT INTO order_items (id, order_id, vehicle_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderItemId, orderId, item.vehicle_id, item.quantity, item.price]
      );

      // Optionally deduct stock of vehicle
      const newStock = Math.max(0, (item.stock || 0) - item.quantity);
      await connection.query(
        'UPDATE vehicles SET stock = ? WHERE id = ?',
        [newStock, item.vehicle_id]
      );
    }

    // 5. Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    await connection.commit();

    const [newOrders] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.status(201).json({
      status: 'success',
      data: { order: newOrders[0] }
    });
  } catch (err) {
    await connection.rollback();
    return next(new AppError(err.message, 500));
  } finally {
    connection.release();
  }
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id]
  );

  if (orders.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: { orders: [] }
    });
  }

  const items = await query(
    `SELECT oi.*, v.name, v.image_url, v.price AS vehicle_price 
     FROM order_items oi 
     JOIN orders o ON oi.order_id = o.id 
     LEFT JOIN vehicles v ON oi.vehicle_id = v.id 
     WHERE o.user_id = ?`,
    [req.user.id]
  );

  orders.forEach(o => {
    o.order_items = items
      .filter(i => i.order_id === o.id)
      .map(i => ({
        id: i.id,
        order_id: i.order_id,
        vehicle_id: i.vehicle_id,
        quantity: i.quantity,
        price: i.price,
        created_at: i.created_at,
        vehicles: i.vehicle_id ? {
          id: i.vehicle_id,
          name: i.name,
          image_url: i.image_url,
          price: i.vehicle_price
        } : null
      }));
  });

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});
