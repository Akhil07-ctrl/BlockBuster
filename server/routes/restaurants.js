const express = require('express');
const router = express.Router();
const { getRestaurants, createRestaurants, getRestaurantById, deleteRestaurants } = require('../controllers/restaurantController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getRestaurants).post(adminAuth, createRestaurants).delete(adminAuth, deleteRestaurants);
router.route('/:id').get(getRestaurantById);

module.exports = router;
