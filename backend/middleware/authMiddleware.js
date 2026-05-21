const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const db = require('../config/db');

const verifyUser = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (!users || users.length === 0) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = users[0];
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
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
