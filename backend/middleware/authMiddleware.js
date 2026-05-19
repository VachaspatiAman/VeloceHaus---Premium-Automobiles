const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { supabaseAdmin } = require('../config/supabase');

const verifyUser = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .single();

  if (error || !user) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  req.user = user;
  next();
});

const verifyAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated.', 401));
  }

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }

  next();
});

// Only superadmin can manage users or assign roles
const verifySuperAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated.', 401));
  }

  if (req.user.role !== 'superadmin') {
    return next(new AppError('Only a superadmin can perform this action.', 403));
  }

  next();
});

module.exports = { verifyUser, verifyAdmin, verifySuperAdmin };
