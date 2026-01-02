const express = require('express');
const router = express.Router();
const { getEvents, createEvents, getEventById } = require('../controllers/eventController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(adminAuth, createEvents);
router.route('/:id').get(getEventById);

module.exports = router;
