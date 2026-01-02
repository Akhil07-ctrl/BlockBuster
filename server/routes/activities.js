const express = require('express');
const router = express.Router();
const { getActivities, createActivities, getActivityById } = require('../controllers/activityController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getActivities).post(adminAuth, createActivities);
router.route('/:id').get(getActivityById);

module.exports = router;
