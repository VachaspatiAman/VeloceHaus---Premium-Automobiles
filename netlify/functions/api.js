/**
 * Veloce – Netlify Serverless Function (api.js)
 * -----------------------------------------------
 * Wraps the entire Express backend with `serverless-http` so every
 * existing route/controller/middleware works without modification.
 *
 * Route mapping (after Netlify proxy in netlify.toml):
 *   /api/auth/*      →  /.netlify/functions/api/auth/*
 *   /api/vehicles/*  →  /.netlify/functions/api/vehicles/*
 *   /api/admin/*     →  /.netlify/functions/api/admin/*
 *   /api/cart/*      →  /.netlify/functions/api/cart/*
 *   /api/orders/*    →  /.netlify/functions/api/orders/*
 *   /api/wishlist/*  →  /.netlify/functions/api/wishlist/*
 *   /api/ai/*        →  /.netlify/functions/api/ai/*
 *   /api/health      →  /.netlify/functions/api/health
 */

'use strict';

require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const serverless   = require('serverless-http');

// ── Shared utilities ──────────────────────────────────────
const AppError          = require('../../backend/utils/AppError');
const globalErrorHandler = require('../../backend/middleware/errorMiddleware');

// ── Route modules ─────────────────────────────────────────
const authRoutes     = require('../../backend/routes/authRoutes');
const vehicleRoutes  = require('../../backend/routes/vehicleRoutes');
const adminRoutes    = require('../../backend/routes/adminRoutes');
const wishlistRoutes = require('../../backend/routes/wishlistRoutes');
const cartRoutes     = require('../../backend/routes/cartRoutes');
const orderRoutes    = require('../../backend/routes/orderRoutes');
const aiRoutes       = require('../../backend/routes/aiRoutes');

// ── Express app ───────────────────────────────────────────
const app = express();

/* ── CORS ─────────────────────────────────────────────────
   Allow the Netlify domain, localhost, and any /.netlify/* origin.
   In production, lock CORS_ORIGIN to your actual Netlify URL.      */
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-site)
    if (!origin) return cb(null, true);
    if (
      allowedOrigins.length === 0 ||       // open during dev / not set
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin)
    ) {
      return cb(null, true);
    }
    return cb(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight globally
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/ai',       aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status:  'success',
    message: 'Veloce API is live ✅',
    env:     process.env.NODE_ENV || 'production',
    ts:      new Date().toISOString(),
  });
});

// 404 catch-all
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// ── Export as Netlify handler ─────────────────────────────
module.exports.handler = serverless(app);
