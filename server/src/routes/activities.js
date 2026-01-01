const express = require('express');
const router = express.Router();
const { getActivities, createActivities, getActivityById } = require('../controllers/activityController');

router.route('/').get(getActivities).post(createActivities);
router.route('/:id').get(getActivityById);

module.exports = router;
