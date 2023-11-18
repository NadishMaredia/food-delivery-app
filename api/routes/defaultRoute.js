const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');

// Define routes
router.get('/', defaultController.defaultApi);

module.exports = router;
