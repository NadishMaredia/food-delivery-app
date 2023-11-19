const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Define routes
router.post('/menu/add', menuController.addMenu);
router.get('/menu/list', menuController.getAllMenu);
router.get('/menu/:menuId', menuController.getMenuById);
router.get('/menu/restaurant/:hotelId', menuController.getMenuByRestaurantId);
router.put('/menu/:menuId', menuController.updateMenu);
router.delete('/menu/:hotelId', menuController.deleteMenu);
router.get('/menu/sort/:hotelId', menuController.getMenuSorted);

module.exports = router;
