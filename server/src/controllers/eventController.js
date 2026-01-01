const Event = require('../models/Event');
const City = require('../models/City');
const Venue = require('../models/Venue');
const asyncHandler = require('../middleware/asyncHandler');
const slugify = require('slugify');

// @desc    Get all events (filtered by city)
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const { city, type } = req.query;
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

    const events = await Event.find(query).populate('venue').populate('city');
    res.json(events);
});

// @desc    Create events (single or bulk)
// @route   POST /api/events
// @access  Public
const createEvents = asyncHandler(async (req, res) => {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Process each event to resolve slugs to ObjectIds
    const processedEvents = await Promise.all(data.map(async (event) => {
        const processed = { ...event };

        // Auto-generate slug if not provided
        processed.slug = event.slug || slugify(event.title, { lower: true, strict: true });

        // Resolve citySlug to city ObjectId
        if (event.citySlug) {
            const city = await City.findOne({ slug: event.citySlug });
            if (!city) {
                throw new Error(`City with slug "${event.citySlug}" not found`);
            }
            processed.city = city._id;
            delete processed.citySlug;
        }

        // Resolve venueSlug to venue ObjectId
        if (event.venueSlug) {
            const venue = await Venue.findOne({ slug: event.venueSlug });
            if (!venue) {
                throw new Error(`Venue with slug "${event.venueSlug}" not found`);
            }
            processed.venue = venue._id;
            delete processed.venueSlug;
        }

        return processed;
    }));

    if (processedEvents.length === 1) {
        const event = await Event.create(processedEvents[0]);
        res.status(201).json(event);
    } else {
        const events = await Event.insertMany(processedEvents);
        res.status(201).json(events);
    }
});

// @desc    Get event details
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('venue').populate('city');
    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
    getEvents,
    createEvents,
    getEventById
};
