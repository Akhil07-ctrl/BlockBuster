const express = require('express');
const router = express.Router();
const { getMovies, createMovies, getMovieById } = require('../controllers/movieController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(adminAuth, createMovies);
router.route('/:id').get(getMovieById);

module.exports = router;
