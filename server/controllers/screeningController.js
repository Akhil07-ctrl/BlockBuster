const Screening = require('../models/Screening');
const Movie = require('../models/Movie');
const City = require('../models/City');
const Venue = require('../models/Venue');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Create or Update Screening
// @route   POST /api/screenings
// @access  Private
const createScreening = asyncHandler(async (req, res) => {
    const screeningsData = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const data of screeningsData) {
        const { movieSlug, city: citySlug, theatre, screens } = data;

        // 1. Find Movie
        const movie = await Movie.findOne({ slug: movieSlug });
        if (!movie) {
            console.error(`Movie not found for slug: ${movieSlug}`);
            continue;
        }

        // 2. Find City
        const city = await City.findOne({ slug: citySlug });
        if (!city) {
            console.error(`City not found for slug: ${citySlug}`);
            continue;
        }

        // 3. Find or Create Venue
        let venue = await Venue.findOne({ 
            slug: slugify(theatre.name, { lower: true, strict: true }),
            city: city._id
        });

        if (!venue) {
            venue = await Venue.create({
                name: theatre.name,
                slug: slugify(theatre.name, { lower: true, strict: true }),
                address: theatre.location,
                city: city._id,
                type: 'Cinema'
            });
        }

        // 4. Update or Create Screening
        const screening = await Screening.findOneAndUpdate(
            { movie: movie._id, venue: venue._id },
            { 
                movie: movie._id, 
                city: city._id, 
                venue: venue._id, 
                screens 
            },
            { upsert: true, new: true, runValidators: true }
        );
        results.push(screening);
    }

    res.status(201).json(results.length === 1 && !Array.isArray(req.body) ? results[0] : results);
});

// @desc    Get screenings for a movie in a city
// @route   GET /api/screenings/:movieSlug/:citySlug
// @access  Public
const getScreenings = asyncHandler(async (req, res) => {
    const { movieSlug, citySlug } = req.params;

    const movie = await Movie.findOne({ slug: movieSlug });
    const city = await City.findOne({ slug: citySlug });

    if (!movie || !city) {
        res.status(404);
        throw new Error('Movie or City not found');
    }

    const screenings = await Screening.find({ 
        movie: movie._id, 
        city: city._id 
    }).populate('venue');

    res.json({
        movie,
        city,
        screenings
    });
});

module.exports = {
    createScreening,
    getScreenings
};
