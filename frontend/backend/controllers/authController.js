const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '90d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { full_name, name, email, password, phone, role } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check if email already exists
  const existingUsers = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUsers && existingUsers.length > 0) {
    return next(new AppError('Email address is already in use!', 400));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Assign user role, but prevent regular users from creating admins
  const userRole = role === 'admin' ? 'user' : (role || 'user'); 
  const id = crypto.randomUUID();

  // Insert into MySQL
  await db.query(
    'INSERT INTO users (id, full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
    [id, full_name || name, email, hashedPassword, phone || null, userRole]
  );

  // Retrieve new user
  const newUsers = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!newUsers || newUsers.length === 0) {
    return next(new AppError('Failed to create user. Please try again.', 500));
  }

  createSendToken(newUsers[0], 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = users[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.googleOAuth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'For Google OAuth, please use JWT credentials or login locally.'
  });
});
