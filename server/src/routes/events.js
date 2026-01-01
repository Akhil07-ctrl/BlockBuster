const express = require('express');
const router = express.Router();
const { getEvents, createEvents, getEventById } = require('../controllers/eventController');

router.route('/').get(getEvents).post(createEvents);
router.route('/:id').get(getEventById);

module.exports = router;
