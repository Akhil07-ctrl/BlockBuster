const Store = require('../models/Store');
const City = require('../models/City');
const Venue = require('../models/Venue');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all stores (filtered by city)
// @route   GET /api/stores
// @access  Public
const getStores = asyncHandler(async (req, res) => {
    const { city, category } = req.query;
    let query = {};

    if (city) {
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            query.city = cityDoc._id;
        } else {
            return res.json([]);
        }
    }

    if (category) {
        query.category = category;
    }

    const stores = await Store.find(query).populate('venue').populate('city');
    res.json(stores);
});

// @desc    Create/Update stores (single or bulk with UPSERT)
// @route   POST /api/stores
// @access  Public
const createStores = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Process each store to resolve slugs to ObjectIds
    const processedStores = await Promise.all(data.map(async (store) => {
        const processed = { ...store };

        // Auto-generate slug if not provided
        processed.slug = store.slug || slugify(store.title, { lower: true, strict: true });

        // Resolve citySlug to city ObjectId
        if (store.citySlug) {
            const city = await City.findOne({ slug: store.citySlug });
            if (!city) {
                throw new Error(`City with slug "${store.citySlug}" not found`);
            }
            processed.city = city._id;
            delete processed.citySlug;
        }

        // Resolve venueSlug to venue ObjectId
        if (store.venueSlug) {
            const venue = await Venue.findOne({ slug: store.venueSlug });
            if (!venue) {
                throw new Error(`Venue with slug "${store.venueSlug}" not found`);
            }
            processed.venue = venue._id;
            delete processed.venueSlug;
        }

        return processed;
    }));

    // Use bulkWrite with upsert
    const operations = processedStores.map(store => ({
        updateOne: {
            filter: { slug: store.slug },
            update: { $set: store },
            upsert: true
        }
    }));

    const result = await Store.bulkWrite(operations);

    res.status(200).json({
        message: 'Stores inserted/updated successfully',
        inserted: result.upsertedCount,
        updated: result.modifiedCount
    });
});

// @desc    Get store details
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('venue').populate('city');
    if (store) {
        res.json(store);
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

module.exports = {
    getStores,
    createStores,
    getStoreById
};
