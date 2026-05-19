const { supabaseAdmin } = require('../config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      users (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      users (
        id,
        email,
        full_name
      ),
      order_items (
        *,
        vehicles (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq('id', req.params.id)
    .single();

  if (error) return next(new AppError(error.message, 404));

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { order }
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  // First delete order items
  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .delete()
    .eq('order_id', req.params.id);

  if (itemsError) return next(new AppError(itemsError.message, 400));

  // Then delete the order
  const { error } = await supabaseAdmin
    .from('orders')
    .delete()
    .eq('id', req.params.id);

  if (error) return next(new AppError(error.message, 400));

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  // 1. Fetch user's cart items
  const { data: cartItems, error: cartError } = await supabaseAdmin
    .from('cart')
    .select('*, vehicles(price)')
    .eq('user_id', userId);
    
  if (cartError) return next(new AppError(cartError.message, 400));
  if (!cartItems || cartItems.length === 0) return next(new AppError('Cart is empty', 400));
  
  // 2. Calculate total amount
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.quantity * (item.vehicles?.price || 0)), 0);
  
  // 3. Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert([{ user_id: userId, total_amount: totalAmount, status: 'pending' }])
    .select()
    .single();
    
  if (orderError) return next(new AppError(orderError.message, 400));
  
  // 4. Create order items
  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    vehicle_id: item.vehicle_id,
    quantity: item.quantity,
    price: item.vehicles?.price || 0
  }));
  
  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItemsData);
    
  if (itemsError) return next(new AppError(itemsError.message, 400));
  
  // 5. Clear cart
  await supabaseAdmin
    .from('cart')
    .delete()
    .eq('user_id', userId);
    
  res.status(201).json({
    status: 'success',
    data: { order }
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        vehicles (
          id,
          name,
          image_url,
          price
        )
      )
    `)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return next(new AppError(error.message, 400));

  res.status(200).json({
    status: 'success',
    data: { orders }
  });
});
