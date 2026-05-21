const express = require('express');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const { verifyUser, verifyAdmin, verifySuperAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser, verifyAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Vehicles
router.post('/vehicles', adminController.addVehicle);
router.put('/vehicles/:id', adminController.updateVehicle);
router.delete('/vehicles/:id', adminController.deleteVehicle);
router.post('/upload', adminController.uploadMiddleware, adminController.uploadImage);

// Orders
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.delete('/orders/:id', orderController.deleteOrder);

// Users — superadmin only
router.get('/users', verifySuperAdmin, userController.getAllUsers);
router.get('/users/:id', verifySuperAdmin, userController.getUserById);
router.put('/users/:id', verifySuperAdmin, userController.updateUser);
router.delete('/users/:id', verifySuperAdmin, userController.deleteUser);
router.put('/users/:id/assign-role', verifySuperAdmin, userController.assignRole);

module.exports = router;
