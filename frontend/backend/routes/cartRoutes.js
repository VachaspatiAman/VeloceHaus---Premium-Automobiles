const express = require('express');
const cartController = require('../controllers/cartController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCart);
router.delete('/remove/:id', cartController.removeFromCart);

module.exports = router;
