const crypto = require('crypto');
const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getCart = catchAsync(async (req, res, next) => {
  const rows = await db.query(
    `SELECT c.id AS cart_id, c.quantity, c.created_at AS cart_created_at,
            v.id AS vehicle_id, v.name, v.brand, v.type, v.fuelType, v.price, 
            v.stock, v.image_url, v.featured, v.description, v.color_variants
     FROM cart c
     JOIN vehicles v ON c.vehicle_id = v.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );

  const cart = rows.map(row => {
    let colorVariants = [];
    if (row.color_variants && typeof row.color_variants === 'string') {
      try {
        colorVariants = JSON.parse(row.color_variants);
      } catch (e) {
        colorVariants = [];
      }
    } else if (Array.isArray(row.color_variants)) {
      colorVariants = row.color_variants;
    }

    return {
      id: row.cart_id,
      user_id: req.user.id,
      vehicle_id: row.vehicle_id,
      quantity: row.quantity,
      created_at: row.cart_created_at,
      vehicles: {
        id: row.vehicle_id,
        name: row.name,
        brand: row.brand,
        type: row.type,
        fuelType: row.fuelType,
        price: row.price,
        stock: row.stock,
        image_url: row.image_url,
        featured: Boolean(row.featured),
        description: row.description,
        color_variants: colorVariants
      }
    };
  });

  res.status(200).json({
    status: 'success',
    results: cart.length,
    data: { cart }
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { vehicle_id, quantity } = req.body;

  if (!vehicle_id) {
    return next(new AppError('Please provide a vehicle_id', 400));
  }

  // Check if item already exists in user's cart
  const existing = await db.query(
    'SELECT id, quantity FROM cart WHERE user_id = ? AND vehicle_id = ?',
    [req.user.id, vehicle_id]
  );

  let cartId;
  const qty = quantity || 1;

  if (existing && existing.length > 0) {
    // Update existing item quantity
    cartId = existing[0].id;
    await db.query(
      'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
      [qty, cartId]
    );
  } else {
    // Insert new item
    cartId = crypto.randomUUID();
    await db.query(
      'INSERT INTO cart (id, user_id, vehicle_id, quantity) VALUES (?, ?, ?, ?)',
      [cartId, req.user.id, vehicle_id, qty]
    );
  }

  const items = await db.query('SELECT * FROM cart WHERE id = ?', [cartId]);

  res.status(201).json({
    status: 'success',
    data: { cartItem: items[0] }
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { cart_id, quantity } = req.body;

  if (!cart_id || quantity === undefined) {
    return next(new AppError('Please provide cart_id and quantity', 400));
  }

  await db.query(
    'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, cart_id, req.user.id]
  );

  const items = await db.query('SELECT * FROM cart WHERE id = ?', [cart_id]);

  if (!items || items.length === 0) {
    return next(new AppError('Cart item not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { cartItem: items[0] }
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  await db.query(
    'DELETE FROM cart WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});
