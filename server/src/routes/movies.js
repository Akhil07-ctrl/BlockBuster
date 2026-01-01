const express = require('express');
const router = express.Router();
const { getMovies, createMovies, getMovieById } = require('../controllers/movieController');

router.route('/').get(getMovies).post(createMovies);
router.route('/:id').get(getMovieById);

module.exports = router;
