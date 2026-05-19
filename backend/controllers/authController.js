const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
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

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Assign user role, but prevent regular users from creating admins
  const userRole = role === 'admin' ? 'user' : (role || 'user'); 

  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert([
      { 
        full_name: full_name || name, 
        email, 
        password: hashedPassword, 
        phone,
        role: userRole 
      }
    ])
    .select()
    .single();

  if (error) {
    return next(new AppError(error.message, 400));
  }

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.googleOAuth = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'For Google OAuth, please use Supabase Auth directly on the frontend and send the resulting token to backend.'
  });
});
