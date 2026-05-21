const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.aiChat = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return next(new AppError('Please provide a query string.', 400));
  }

  const queryLower = query.toLowerCase();

  let maxPrice = null;
  let vehicleType = null;

  const match = queryLower.match(/under (\d+) lakh/);
  if (match) {
    maxPrice = parseInt(match[1], 10) * 100000;
  }

  if (queryLower.includes('sports') || queryLower.includes('car')) {
    vehicleType = 'car';
  } else if (queryLower.includes('bike') || queryLower.includes('motorcycle')) {
    vehicleType = 'bike';
  }

  let sql = 'SELECT * FROM vehicles WHERE 1=1';
  const params = [];
  
  if (maxPrice) {
    sql += ' AND price <= ?';
    params.push(maxPrice);
  }
  if (vehicleType) {
    sql += ' AND type = ?';
    params.push(vehicleType);
  }

  sql += ' LIMIT 5';

  const vehicles = await db.query(sql, params);

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
    message: `Here are some recommendations based on your query: "${query}"`,
    results: formattedVehicles.length,
    data: { vehicles: formattedVehicles }
  });
});

exports.getPersonalizedRecommendations = catchAsync(async (req, res, next) => {
  const vehicles = await db.query('SELECT * FROM vehicles LIMIT 4');

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
    data: { vehicles: formattedVehicles }
  });
});

exports.getSimilarVehicles = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.params;

  const vehicles = await db.query('SELECT type, brand FROM vehicles WHERE id = ?', [vehicleId]);
  const vehicle = vehicles[0];

  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  const similar = await db.query(
    'SELECT * FROM vehicles WHERE type = ? AND id != ? LIMIT 4',
    [vehicle.type, vehicleId]
  );

  const formattedSimilar = similar.map(v => {
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
    data: { vehicles: formattedSimilar }
  });
});
