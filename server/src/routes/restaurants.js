const express = require('express');
const router = express.Router();
const { getRestaurants, createRestaurants, getRestaurantById } = require('../controllers/restaurantController');

router.route('/').get(getRestaurants).post(createRestaurants);
router.route('/:id').get(getRestaurantById);

module.exports = router;
