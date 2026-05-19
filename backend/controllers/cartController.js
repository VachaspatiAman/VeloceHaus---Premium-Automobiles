const { supabase } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getCart = catchAsync(async (req, res, next) => {
  const { data: cart, error } = await supabase
    .from('cart')
    .select('*, vehicles(*)')
    .eq('user_id', req.user.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    results: cart?.length || 0,
    data: { cart }
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { vehicle_id, quantity } = req.body;

  const { data: cartItem, error } = await supabase
    .from('cart')
    .insert([{ user_id: req.user.id, vehicle_id, quantity: quantity || 1 }])
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(201).json({
    status: 'success',
    data: { cartItem }
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { cart_id, quantity } = req.body;

  const { data: cartItem, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cart_id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { cartItem }
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
