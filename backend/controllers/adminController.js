const { supabaseAdmin } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const multer = require('multer');

const storage = multer.memoryStorage();
exports.uploadMiddleware = multer({ storage }).single('image');

const extractVehicleFields = (body) => {
  const {
    name, brand, type, fueltype, price, stock, featured, description, image_url,
    // Specs
    engine, transmission, horsepower, torque, mileage, seats, top_speed, warranty,
    // Color variants (array of { color_name, hex_code, image_url })
    color_variants
  } = body;

  return {
    name, brand, type, fueltype,
    price: price !== undefined ? Number(price) : undefined,
    stock: stock !== undefined ? Number(stock) : undefined,
    featured: featured !== undefined ? Boolean(featured) : undefined,
    description, image_url,
    engine, transmission,
    horsepower: horsepower ? Number(horsepower) : null,
    torque, mileage,
    seats: seats ? Number(seats) : null,
    top_speed: top_speed ? Number(top_speed) : null,
    warranty,
    color_variants: Array.isArray(color_variants) ? color_variants : null
  };
};

exports.addVehicle = catchAsync(async (req, res, next) => {
  const fields = extractVehicleFields(req.body);

  const { data: vehicle, error } = await supabaseAdmin
    .from('vehicles')
    .insert([fields])
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(201).json({ status: 'success', data: { vehicle } });
});

exports.updateVehicle = catchAsync(async (req, res, next) => {
  const fields = extractVehicleFields(req.body);
  // Remove undefined keys so we don't overwrite untouched fields with null
  Object.keys(fields).forEach(k => fields[k] === undefined && delete fields[k]);

  const { data: vehicle, error } = await supabaseAdmin
    .from('vehicles')
    .update(fields)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({ status: 'success', data: { vehicle } });
});

exports.deleteVehicle = catchAsync(async (req, res, next) => {
  const { error } = await supabaseAdmin
    .from('vehicles')
    .delete()
    .eq('id', req.params.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload an image.', 400));

  const fileExt = req.file.originalname.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `vehicles/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('vehicle-images')
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype
    });

  if (error) return next(new AppError(error.message, 400));

  const { data: publicUrlData } = supabaseAdmin.storage
    .from('vehicle-images')
    .getPublicUrl(filePath);

  res.status(200).json({
    status: 'success',
    data: {
      url: publicUrlData.publicUrl
    }
  });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const { count: usersCount, error: userErr } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true });

  const { count: vehiclesCount, error: vehicleErr } = await supabaseAdmin
    .from('vehicles')
    .select('*', { count: 'exact', head: true });

  const { count: ordersCount, error: orderErr } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const revenue = 1500000; // Mocked logic, could sum from orders table

  if (userErr || vehicleErr || orderErr) {
    return next(new AppError('Error fetching dashboard stats', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers: usersCount || 0,
      totalVehicles: vehiclesCount || 0,
      orders: ordersCount || 0,
      revenue
    }
  });
});
