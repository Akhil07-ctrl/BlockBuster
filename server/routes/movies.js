const express = require('express');
const router = express.Router();
const { getMovies, createMovies, getMovieById, deleteMovies } = require('../controllers/movieController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(adminAuth, createMovies).delete(adminAuth, deleteMovies);
router.route('/:id').get(getMovieById);

module.exports = router;
