const Movie = require('../models/Movie');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({});
    res.json(movies);
});

// @desc    Create movies (single or bulk)
// @route   POST /api/movies
// @access  Public
const createMovies = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Auto-generate slugs if not provided
    const moviesWithSlugs = data.map(movie => ({
        ...movie,
        slug: movie.slug || slugify(movie.title, { lower: true, strict: true })
    }));

    if (moviesWithSlugs.length === 1) {
        const movie = await Movie.create(moviesWithSlugs[0]);
        res.status(201).json(movie);
    } else {
        const movies = await Movie.insertMany(moviesWithSlugs);
        res.status(201).json(movies);
    }
});

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404);
        throw new Error('Movie not found');
    }
});

module.exports = {
    getMovies,
    createMovies,
    getMovieById
};
