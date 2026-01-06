const Movie = require('../models/Movie');
const City = require('../models/City');
const Screening = require('../models/Screening');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all movies (optionally filtered by city)
// @route   GET /api/movies?city=slug
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
    const { city } = req.query;
    let query = {};

    if (city) {
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            // Find all movie IDs that have screenings in this city
            const screeningMovieIds = await Screening.distinct('movie', { city: cityDoc._id });
            query._id = { $in: screeningMovieIds };
        } else {
            // If city provided but not found, return empty
            return res.json([]);
        }
    }

    const movies = await Movie.find(query);
    res.json(movies);
});

// @desc    Create/Update movies (single or bulk with UPSERT)
// @route   POST /api/movies
// @access  Public
const createMovies = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Auto-generate slugs if not provided
    const moviesWithSlugs = data.map(movie => ({
        ...movie,
        slug: movie.slug || slugify(movie.title, { lower: true, strict: true })
    }));

    // Use bulkWrite with upsert
    const operations = moviesWithSlugs.map(movie => ({
        updateOne: {
            filter: { slug: movie.slug },
            update: { $set: movie },
            upsert: true
        }
    }));

    const result = await Movie.bulkWrite(operations);

    res.status(200).json({
        message: 'Movies inserted/updated successfully',
        inserted: result.upsertedCount,
        updated: result.modifiedCount
    });
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
