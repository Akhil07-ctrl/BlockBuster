const express = require('express');
const router = express.Router();
const { createScreening, getScreenings, deleteScreenings } = require('../controllers/screeningController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').post(createScreening).delete(adminAuth, deleteScreenings);
router.get('/:movieSlug/:citySlug', getScreenings);

module.exports = router;
