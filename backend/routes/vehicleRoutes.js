const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicle);

module.exports = router;
