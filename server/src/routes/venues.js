const express = require('express');
const router = express.Router();
const { getVenues, createVenues } = require('../controllers/venueController');

router.route('/').get(getVenues).post(createVenues);

module.exports = router;
