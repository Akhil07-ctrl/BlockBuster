const express = require('express');
const router = express.Router();
const { getActivities, createActivities, getActivityById, deleteActivities } = require('../controllers/activityController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getActivities).post(adminAuth, createActivities).delete(adminAuth, deleteActivities);
router.route('/:id').get(getActivityById);

module.exports = router;
