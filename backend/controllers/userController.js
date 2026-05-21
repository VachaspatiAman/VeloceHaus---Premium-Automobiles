const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  const orders = await db.query('SELECT id, user_id, status, total_amount, created_at FROM orders');

  users.forEach(u => {
    u.password = undefined;
    u.orders = orders.filter(o => o.user_id === u.id);
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const users = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

  if (!users || users.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  const user = users[0];
  user.password = undefined;

  const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.params.id]);

  if (orders.length > 0) {
    const orderIds = orders.map(o => o.id);
    // Dynamic placeholder list for IN clause
    const placeholders = orderIds.map(() => '?').join(',');
    const orderItems = await db.query(
      `SELECT oi.*, v.name, v.price AS vehicle_price, v.image_url 
       FROM order_items oi 
       LEFT JOIN vehicles v ON oi.vehicle_id = v.id 
       WHERE oi.order_id IN (${placeholders})`,
      orderIds
    );

    orders.forEach(o => {
      o.order_items = orderItems
        .filter(item => item.order_id === o.id)
        .map(item => ({
          id: item.id,
          order_id: item.order_id,
          vehicle_id: item.vehicle_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          vehicles: item.vehicle_id ? {
            id: item.vehicle_id,
            name: item.name,
            price: item.vehicle_price,
            image_url: item.image_url
          } : null
        }));
    });
  }

  user.orders = orders;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { full_name, phone, role } = req.body;

  await db.query(
    'UPDATE users SET full_name = ?, phone = ?, role = ? WHERE id = ?',
    [full_name, phone, role, req.params.id]
  );

  const users = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

  if (!users || users.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  const user = users[0];
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // First check if user has orders
  const orders = await db.query('SELECT id FROM orders WHERE user_id = ?', [req.params.id]);

  if (orders && orders.length > 0) {
    return next(new AppError('Cannot delete user with existing orders', 400));
  }

  // Delete the user
  const result = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

  if (result.affectedRows === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Superadmin-only: assign or revoke admin role
exports.assignRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  // Superadmin can promote to superadmin, admin, or demote to user
  if (!['user', 'admin', 'superadmin'].includes(role)) {
    return next(new AppError("Role must be 'user', 'admin', or 'superadmin'.", 400));
  }

  await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);

  const users = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);

  if (!users || users.length === 0) {
    return next(new AppError('No user found with that ID', 404));
  }

  const user = users[0];
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    message: `User role updated to '${role}' successfully.`,
    data: { user }
  });
});
