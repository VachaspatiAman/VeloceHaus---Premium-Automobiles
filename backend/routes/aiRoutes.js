const express = require('express');
const aiController = require('../controllers/aiController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ai-chat', aiController.aiChat);
router.get('/recommendations/personalized', verifyUser, aiController.getPersonalizedRecommendations);
router.get('/recommendations/similar/:vehicleId', aiController.getSimilarVehicles);

module.exports = router;
