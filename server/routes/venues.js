const express = require('express');
const router = express.Router();
const { getVenues, createVenues } = require('../controllers/venueController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getVenues).post(adminAuth, createVenues);

module.exports = router;
