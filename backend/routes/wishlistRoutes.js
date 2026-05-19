const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addToWishlist);
router.delete('/remove/:id', wishlistController.removeFromWishlist);

module.exports = router;
