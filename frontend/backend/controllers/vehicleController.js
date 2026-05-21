const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllVehicles = catchAsync(async (req, res, next) => {
  let sql = 'SELECT * FROM vehicles WHERE 1=1';
  const params = [];

  // Filters
  if (req.query.brand) {
    sql += ' AND brand = ?';
    params.push(req.query.brand);
  }
  if (req.query.type) {
    sql += ' AND type = ?';
    params.push(req.query.type);
  }
  if (req.query.fuelType) {
    sql += ' AND fuelType = ?';
    params.push(req.query.fuelType);
  }
  if (req.query.maxPrice) {
    sql += ' AND price <= ?';
    params.push(Number(req.query.maxPrice));
  }
  if (req.query.minPrice) {
    sql += ' AND price >= ?';
    params.push(Number(req.query.minPrice));
  }

  const vehicles = await db.query(sql, params);

  // Parse color_variants JSON if returned as string
  const formattedVehicles = vehicles.map(v => {
    if (v.color_variants && typeof v.color_variants === 'string') {
      try {
        v.color_variants = JSON.parse(v.color_variants);
      } catch (e) {
        v.color_variants = [];
      }
    }
    return v;
  });

  res.status(200).json({
    status: 'success',
    results: formattedVehicles.length,
    data: { vehicles: formattedVehicles }
  });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
  const vehicles = await db.query('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);

  if (!vehicles || vehicles.length === 0) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  const vehicle = vehicles[0];
  if (vehicle.color_variants && typeof vehicle.color_variants === 'string') {
    try {
      vehicle.color_variants = JSON.parse(vehicle.color_variants);
    } catch (e) {
      vehicle.color_variants = [];
    }
  }

  res.status(200).json({
    status: 'success',
    data: { vehicle }
  });
});

exports.getFeaturedVehicles = catchAsync(async (req, res, next) => {
  const vehicles = await db.query('SELECT * FROM vehicles WHERE featured = 1');

  const formattedVehicles = vehicles.map(v => {
    if (v.color_variants && typeof v.color_variants === 'string') {
      try {
        v.color_variants = JSON.parse(v.color_variants);
      } catch (e) {
        v.color_variants = [];
      }
    }
    return v;
  });

  res.status(200).json({
    status: 'success',
    results: formattedVehicles.length,
    data: { vehicles: formattedVehicles }
  });
});
