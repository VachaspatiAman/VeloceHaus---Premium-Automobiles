const { supabaseAdmin } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllVehicles = catchAsync(async (req, res, next) => {
  let query = supabaseAdmin.from('vehicles').select('*');

  // Filters
  if (req.query.brand) query = query.eq('brand', req.query.brand);
  if (req.query.type) query = query.eq('type', req.query.type);
  if (req.query.fuelType) query = query.eq('fuelType', req.query.fuelType);
  if (req.query.maxPrice) query = query.lte('price', req.query.maxPrice);
  if (req.query.minPrice) query = query.gte('price', req.query.minPrice);

  const { data: vehicles, error } = await query;

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    results: vehicles?.length || 0,
    data: { vehicles }
  });
});

exports.getVehicle = catchAsync(async (req, res, next) => {
  const { data: vehicle, error } = await supabaseAdmin
    .from('vehicles')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vehicle) return next(new AppError('No vehicle found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { vehicle }
  });
});

exports.getFeaturedVehicles = catchAsync(async (req, res, next) => {
  const { data: vehicles, error } = await supabaseAdmin
    .from('vehicles')
    .select('*')
    .eq('featured', true);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    results: vehicles?.length || 0,
    data: { vehicles }
  });
});
