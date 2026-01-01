const Activity = require('../models/Activity');
const City = require('../models/City');
const Venue = require('../models/Venue');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all activities (filtered by city)
// @route   GET /api/activities
// @access  Public
const getActivities = asyncHandler(async (req, res) => {
    const { city, type, difficulty } = req.query;
    let query = {};

    if (city) {
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            query.city = cityDoc._id;
        } else {
            return res.json([]);
        }
    }

    if (type) {
        query.type = type;
    }

    if (difficulty) {
        query.difficulty = difficulty;
    }

    const activities = await Activity.find(query).populate('venue').populate('city');
    res.json(activities);
});

// @desc    Create activities (single or bulk)
// @route   POST /api/activities
// @access  Public
const createActivities = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Process each activity to resolve slugs to ObjectIds
    const processedActivities = await Promise.all(data.map(async (activity) => {
        const processed = { ...activity };

        // Auto-generate slug if not provided
        processed.slug = activity.slug || slugify(activity.title, { lower: true, strict: true });

        // Resolve citySlug to city ObjectId
        if (activity.citySlug) {
            const city = await City.findOne({ slug: activity.citySlug });
            if (!city) {
                throw new Error(`City with slug "${activity.citySlug}" not found`);
            }
            processed.city = city._id;
            delete processed.citySlug;
        }

        // Resolve venueSlug to venue ObjectId
        if (activity.venueSlug) {
            const venue = await Venue.findOne({ slug: activity.venueSlug });
            if (!venue) {
                throw new Error(`Venue with slug "${activity.venueSlug}" not found`);
            }
            processed.venue = venue._id;
            delete processed.venueSlug;
        }

        return processed;
    }));

    if (processedActivities.length === 1) {
        const activity = await Activity.create(processedActivities[0]);
        res.status(201).json(activity);
    } else {
        const activities = await Activity.insertMany(processedActivities);
        res.status(201).json(activities);
    }
});

// @desc    Get activity details
// @route   GET /api/activities/:id
// @access  Public
const getActivityById = asyncHandler(async (req, res) => {
    const activity = await Activity.findById(req.params.id).populate('venue').populate('city');
    if (activity) {
        res.json(activity);
    } else {
        res.status(404);
        throw new Error('Activity not found');
    }
});

module.exports = {
    getActivities,
    createActivities,
    getActivityById
};
