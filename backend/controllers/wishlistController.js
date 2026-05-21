const crypto = require('crypto');
const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getWishlist = catchAsync(async (req, res, next) => {
  const rows = await db.query(
    `SELECT w.id AS wishlist_id, w.created_at AS wishlist_created_at,
            v.id AS vehicle_id, v.name, v.brand, v.type, v.fuelType, v.price, 
            v.stock, v.image_url, v.featured, v.description, v.color_variants
     FROM wishlist w
     JOIN vehicles v ON w.vehicle_id = v.id
     WHERE w.user_id = ?`,
    [req.user.id]
  );

  const wishlist = rows.map(row => {
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
      id: row.wishlist_id,
      user_id: req.user.id,
      vehicle_id: row.vehicle_id,
      created_at: row.wishlist_created_at,
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
    results: wishlist.length,
    data: { wishlist }
  });
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { vehicle_id } = req.body;

  if (!vehicle_id) {
    return next(new AppError('Please provide a vehicle_id', 400));
  }

  // Check if already in wishlist to avoid unique key error
  const existing = await db.query(
    'SELECT id FROM wishlist WHERE user_id = ? AND vehicle_id = ?',
    [req.user.id, vehicle_id]
  );

  if (existing && existing.length > 0) {
    return res.status(200).json({
      status: 'success',
      data: { wishlistItem: existing[0] }
    });
  }

  const id = crypto.randomUUID();
  await db.query(
    'INSERT INTO wishlist (id, user_id, vehicle_id) VALUES (?, ?, ?)',
    [id, req.user.id, vehicle_id]
  );

  const newItems = await db.query('SELECT * FROM wishlist WHERE id = ?', [id]);

  res.status(201).json({
    status: 'success',
    data: { wishlistItem: newItems[0] }
  });
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  await db.query(
    'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );

  res.status(204).json({
    status: 'success',
    data: null
  });
});
