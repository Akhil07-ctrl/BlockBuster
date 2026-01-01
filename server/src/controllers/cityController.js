const City = require('../models/City');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = asyncHandler(async (req, res) => {
    const cities = await City.find({}).sort({ name: 1 });
    res.json(cities);
});

// @desc    Create/Update cities (single or bulk with UPSERT)
// @route   POST /api/cities
// @access  Public
const createCities = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Auto-generate slugs if not provided
    const citiesWithSlugs = data.map(city => ({
        ...city,
        slug: city.slug || slugify(city.name, { lower: true, strict: true })
    }));

    // Use bulkWrite with upsert to avoid duplicate errors
    const operations = citiesWithSlugs.map(city => ({
        updateOne: {
            filter: { slug: city.slug },
            update: { $set: city },
            upsert: true
        }
    }));

    const result = await City.bulkWrite(operations);

    res.status(200).json({
        message: 'Cities inserted/updated successfully',
        inserted: result.upsertedCount,
        updated: result.modifiedCount
    });
});

module.exports = {
    getCities,
    createCities
};
