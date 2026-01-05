const express = require('express');
const router = express.Router();
const { createScreening, getScreenings } = require('../controllers/screeningController');

router.post('/', createScreening);
router.get('/:movieSlug/:citySlug', getScreenings);

module.exports = router;
