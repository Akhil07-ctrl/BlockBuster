const Restaurant = require('../models/Restaurant');
const City = require('../models/City');
const Venue = require('../models/Venue');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all restaurants (filtered by city)
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
    const { city, cuisine } = req.query;
    let query = {};

    if (city) {
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            query.city = cityDoc._id;
        } else {
            return res.json([]);
        }
    }

    if (cuisine) {
        query.cuisine = { $in: [cuisine] };
    }

    const restaurants = await Restaurant.find(query).populate('venue').populate('city');
    res.json(restaurants);
});

// @desc    Create/Update restaurants (single or bulk with UPSERT)
// @route   POST /api/restaurants
// @access  Public
const createRestaurants = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Process each restaurant to resolve slugs to ObjectIds
    const processedRestaurants = await Promise.all(data.map(async (restaurant) => {
        const processed = { ...restaurant };

        // Auto-generate slug if not provided
        processed.slug = restaurant.slug || slugify(restaurant.title, { lower: true, strict: true });

        // Resolve citySlug to city ObjectId
        if (restaurant.citySlug) {
            const city = await City.findOne({ slug: restaurant.citySlug });
            if (!city) {
                throw new Error(`City with slug "${restaurant.citySlug}" not found`);
            }
            processed.city = city._id;
            delete processed.citySlug;
        }

        // Resolve venueSlug to venue ObjectId
        if (restaurant.venueSlug) {
            const venue = await Venue.findOne({ slug: restaurant.venueSlug });
            if (!venue) {
                throw new Error(`Venue with slug "${restaurant.venueSlug}" not found`);
            }
            processed.venue = venue._id;
            delete processed.venueSlug;
        }

        return processed;
    }));

    // Use bulkWrite with upsert
    const operations = processedRestaurants.map(restaurant => ({
        updateOne: {
            filter: { slug: restaurant.slug },
            update: { $set: restaurant },
            upsert: true
        }
    }));

    const result = await Restaurant.bulkWrite(operations);

    res.status(200).json({
        message: 'Restaurants inserted/updated successfully',
        inserted: result.upsertedCount,
        updated: result.modifiedCount
    });
});

// @desc    Get restaurant details
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('venue').populate('city');
    if (restaurant) {
        res.json(restaurant);
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

// @desc    Delete all restaurants
// @route   DELETE /api/restaurants
// @access  Private/Admin
const deleteRestaurants = asyncHandler(async (req, res) => {
    await Restaurant.deleteMany({});
    res.status(200).json({ message: 'All restaurants deleted successfully' });
});

module.exports = {
    getRestaurants,
    createRestaurants,
    getRestaurantById,
    deleteRestaurants
};
