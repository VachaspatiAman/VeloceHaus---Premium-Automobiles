const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.post('/create', orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);

module.exports = router;
