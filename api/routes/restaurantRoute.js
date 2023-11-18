const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Define routes
router.post('/hotel/add', restaurantController.addRestaurant);
router.get('/hotel/list', restaurantController.getAllRestaurant);
router.get('/hotel/:hotelId', restaurantController.getRestaurantById);
router.put('/hotel/:hotelId', restaurantController.updateRestaurant);

module.exports = router;
