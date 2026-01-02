const Venue = require('../models/Venue');
const City = require('../models/City');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get venues
// @route   GET /api/venues
// @access  Public
const getVenues = asyncHandler(async (req, res) => {
    const { city } = req.query;
    let query = {};
    if (city) {
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            query.city = cityDoc._id;
        } else {
            return res.json([]);
        }
    }
    const venues = await Venue.find(query).populate('city', 'name slug');
    res.json(venues);
});

// @desc    Create/Update venues (single or bulk with UPSERT)
// @route   POST /api/venues
// @access  Public
const createVenues = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Process each venue to resolve citySlug to ObjectId
    const processedVenues = await Promise.all(data.map(async (venue) => {
        const processed = { ...venue };

        // Auto-generate slug if not provided
        processed.slug = venue.slug || slugify(venue.name, { lower: true, strict: true });

        // Resolve citySlug to city ObjectId
        if (venue.citySlug) {
            const city = await City.findOne({ slug: venue.citySlug });
            if (!city) {
                throw new Error(`City with slug "${venue.citySlug}" not found`);
            }
            processed.city = city._id;
            delete processed.citySlug;
        }

        return processed;
    }));

    // Use bulkWrite with upsert
    const operations = processedVenues.map(venue => ({
        updateOne: {
            filter: { slug: venue.slug },
            update: { $set: venue },
            upsert: true
        }
    }));

    const result = await Venue.bulkWrite(operations);

    res.status(200).json({
        message: 'Venues inserted/updated successfully',
        inserted: result.upsertedCount,
        updated: result.modifiedCount
    });
});

module.exports = {
    getVenues,
    createVenues
};
