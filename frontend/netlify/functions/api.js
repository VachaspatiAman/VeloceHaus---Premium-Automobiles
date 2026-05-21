/**
 * VeloceHaus – Netlify Serverless Function (api.js)
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

// ── Shared utilities ──────────────────────────────────────
const AppError = require('../../backend/utils/AppError');
const globalErrorHandler = require('../../backend/middleware/errorMiddleware');

// ── Route modules ─────────────────────────────────────────
const authRoutes = require('../../backend/routes/authRoutes');
const vehicleRoutes = require('../../backend/routes/vehicleRoutes');
const adminRoutes = require('../../backend/routes/adminRoutes');
const wishlistRoutes = require('../../backend/routes/wishlistRoutes');
const cartRoutes = require('../../backend/routes/cartRoutes');
const orderRoutes = require('../../backend/routes/orderRoutes');
const aiRoutes = require('../../backend/routes/aiRoutes');

// ── Express app ───────────────────────────────────────────
const app = express();

// Fix Netlify path prefix
app.use((req, res, next) => {
  req.url = req.url.replace(/^\/\.netlify\/functions\/api/, '');
  next();
});

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin)
    ) {
      return cb(null, true);
    }

    return cb(new Error(`CORS: Origin ${origin} not allowed`));
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
    'PATCH'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ]
}));

// ── Body Parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// ── Routes ────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/admin', adminRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/ai', aiRoutes);

// ── Health Check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'VeloceHaus API is live ✅',
    env: process.env.NODE_ENV || 'production',
    ts: new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res, next) => {
  next(new AppError(
    `Route not found: ${req.originalUrl}`,
    404
  ));
});

// ── Global Error Handler ──────────────────────────────────
app.use(globalErrorHandler);

// ── Export Netlify Handler ────────────────────────────────
module.exports.handler = serverless(app);