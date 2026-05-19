const { supabaseAdmin } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      orders (
        id,
        status,
        total_amount,
        created_at
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select(`
      *,
      orders (
        *,
        order_items (
          *,
          vehicles (
            id,
            name,
            price,
            image_url
          )
        )
      )
    `)
    .eq('id', req.params.id)
    .single();

  if (error) return next(new AppError(error.message, 404));

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { full_name, phone, role } = req.body;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({ full_name, phone, role })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // First check if user has orders
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('user_id', req.params.id);

  if (orders && orders.length > 0) {
    return next(new AppError('Cannot delete user with existing orders', 400));
  }

  // Delete the user
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', req.params.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Superadmin-only: assign or revoke admin role
exports.assignRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  // Superadmin can promote to superadmin, admin, or demote to user
  if (!['user', 'admin', 'superadmin'].includes(role)) {
    return next(new AppError("Role must be 'user', 'admin', or 'superadmin'.", 400));
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    message: `User role updated to '${role}' successfully.`,
    data: { user }
  });
});
