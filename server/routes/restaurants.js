const express = require('express');
const router = express.Router();
const { getRestaurants, createRestaurants, getRestaurantById } = require('../controllers/restaurantController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getRestaurants).post(adminAuth, createRestaurants);
router.route('/:id').get(getRestaurantById);

module.exports = router;
