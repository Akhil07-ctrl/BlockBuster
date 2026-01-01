const express = require('express');
const router = express.Router();
const { getCities, createCities } = require('../controllers/cityController');

router.route('/').get(getCities).post(createCities);

module.exports = router;
