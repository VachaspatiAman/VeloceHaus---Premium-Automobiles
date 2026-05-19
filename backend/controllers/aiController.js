const { supabase } = require('../config/supabase');
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
    maxPrice = parseInt(match[1]) * 100000;
  }

  if (queryLower.includes('sports') || queryLower.includes('car')) {
    vehicleType = 'car';
  } else if (queryLower.includes('bike') || queryLower.includes('motorcycle')) {
    vehicleType = 'bike';
  }

  let dbQuery = supabase.from('vehicles').select('*');
  
  if (maxPrice) {
    dbQuery = dbQuery.lte('price', maxPrice);
  }
  if (vehicleType) {
    dbQuery = dbQuery.eq('type', vehicleType);
  }

  const { data: vehicles, error } = await dbQuery.limit(5);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    message: `Here are some recommendations based on your query: "${query}"`,
    results: vehicles?.length || 0,
    data: { vehicles }
  });
});

exports.getPersonalizedRecommendations = catchAsync(async (req, res, next) => {
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .limit(4);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { vehicles }
  });
});

exports.getSimilarVehicles = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.params;

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('type, brand')
    .eq('id', vehicleId)
    .single();

  if (!vehicle) {
    return next(new AppError('Vehicle not found', 404));
  }

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('type', vehicle.type)
    .neq('id', vehicleId)
    .limit(4);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { vehicles }
  });
});
