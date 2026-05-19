const { supabase } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getWishlist = catchAsync(async (req, res, next) => {
  const { data: wishlist, error } = await supabase
    .from('wishlist')
    .select('*, vehicles(*)')
    .eq('user_id', req.user.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    results: wishlist?.length || 0,
    data: { wishlist }
  });
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { vehicle_id } = req.body;

  const { data: wishlistItem, error } = await supabase
    .from('wishlist')
    .insert([{ user_id: req.user.id, vehicle_id }])
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(201).json({
    status: 'success',
    data: { wishlistItem }
  });
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
