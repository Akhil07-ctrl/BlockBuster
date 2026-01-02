const express = require('express');
const router = express.Router();
const { getCities, createCities } = require('../controllers/cityController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getCities).post(adminAuth, createCities);

module.exports = router;
