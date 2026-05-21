const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const multer = require('multer');

const storage = multer.memoryStorage();
exports.uploadMiddleware = multer({ storage }).single('image');

const extractVehicleFields = (body) => {
  const {
    name, brand, type, fueltype, fuelType, price, stock, featured, description, image_url,
    // Specs
    engine, transmission, horsepower, torque, mileage, seats, top_speed, warranty,
    // Color variants
    color_variants
  } = body;

  let parsedColorVariants = null;
  if (color_variants) {
    if (Array.isArray(color_variants)) {
      parsedColorVariants = color_variants;
    } else if (typeof color_variants === 'string') {
      try {
        parsedColorVariants = JSON.parse(color_variants);
      } catch (e) {
        parsedColorVariants = null;
      }
    }
  }

  return {
    name, brand, type,
    fuelType: fuelType || fueltype,
    price: price !== undefined ? Number(price) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    featured: featured !== undefined ? (featured === 'true' || featured === true || featured === 1 || featured === '1' ? 1 : 0) : undefined,
    description, image_url,
    engine, transmission,
    horsepower: horsepower ? Number(horsepower) : null,
    torque, mileage,
    seats: seats ? Number(seats) : null,
    top_speed: top_speed ? Number(top_speed) : null,
    warranty,
    color_variants: parsedColorVariants
  };
};

exports.addVehicle = catchAsync(async (req, res, next) => {
  const fields = extractVehicleFields(req.body);
  const id = crypto.randomUUID();

  const colorVariantsStr = fields.color_variants ? JSON.stringify(fields.color_variants) : null;

  await db.query(
    `INSERT INTO vehicles (
      id, name, brand, type, fuelType, price, stock, image_url, featured, description, 
      engine, transmission, horsepower, torque, mileage, seats, top_speed, warranty, color_variants
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, fields.name, fields.brand, fields.type, fields.fuelType, fields.price, fields.stock, fields.image_url, fields.featured, fields.description,
      fields.engine, fields.transmission, fields.horsepower, fields.torque, fields.mileage, fields.seats, fields.top_speed, fields.warranty, colorVariantsStr
    ]
  );

  const vehicles = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
  const vehicle = vehicles[0];
  if (vehicle && vehicle.color_variants && typeof vehicle.color_variants === 'string') {
    vehicle.color_variants = JSON.parse(vehicle.color_variants);
  }

  res.status(201).json({ status: 'success', data: { vehicle } });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
  const fields = extractVehicleFields(req.body);
  // Remove undefined keys so we don't overwrite untouched fields
  Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

  if (Object.keys(fields).length === 0) {
    return next(new AppError('Please provide fields to update', 400));
  }

  const id = req.params.id;
  const keys = Object.keys(fields);
  const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
  const values = keys.map(k => k === 'color_variants' ? (fields[k] ? JSON.stringify(fields[k]) : null) : fields[k]);
  values.push(id);

  const result = await db.query(`UPDATE vehicles SET ${setClause} WHERE id = ?`, values);

  if (result.affectedRows === 0) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  const vehicles = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);
  const vehicle = vehicles[0];
  if (vehicle && vehicle.color_variants && typeof vehicle.color_variants === 'string') {
    vehicle.color_variants = JSON.parse(vehicle.color_variants);
  }

  res.status(200).json({ status: 'success', data: { vehicle } });
});

exports.deleteVehicle = catchAsync(async (req, res, next) => {
  const result = await db.query('DELETE FROM vehicles WHERE id = ?', [req.params.id]);

  if (result.affectedRows === 0) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload an image.', 400));

  const uploadsDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = req.file.originalname.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, req.file.buffer);

  // Formulate public serving URL
  const host = req.get('host');
  const protocol = req.protocol;
  const publicUrl = `${protocol}://${host}/uploads/${fileName}`;

  res.status(200).json({
    status: 'success',
    data: {
      url: publicUrl
    }
  });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const usersCountResult = await db.query('SELECT COUNT(*) as count FROM users');
  const vehiclesCountResult = await db.query('SELECT COUNT(*) as count FROM vehicles');
  const ordersCountResult = await db.query('SELECT COUNT(*) as count FROM orders');
  const revenueResult = await db.query("SELECT SUM(total_amount) as revenue FROM orders WHERE status != 'cancelled'");

  const totalUsers = usersCountResult[0]?.count || 0;
  const totalVehicles = vehiclesCountResult[0]?.count || 0;
  const orders = ordersCountResult[0]?.count || 0;
  const revenue = Number(revenueResult[0]?.revenue || 0);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalVehicles,
      orders,
      revenue
    }
  });
});
