const Movie = require('../models/Movie');
const Event = require('../models/Event');
const Restaurant = require('../models/Restaurant');
const Store = require('../models/Store');
const Activity = require('../models/Activity');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Global search across all categories
// @route   GET /api/search?q=query&city=slug
// @access  Public
const globalSearch = asyncHandler(async (req, res) => {
    const { q, city } = req.query;

    if (!q || q.trim().length < 2) {
        return res.json({ movies: [], events: [], restaurants: [], stores: [], activities: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    const searchQuery = {
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { tags: searchRegex }
        ]
    };

    // Add city filter if provided
    let cityFilter = {};
    if (city) {
        const City = require('../models/City');
        const cityDoc = await City.findOne({ slug: city });
        if (cityDoc) {
            cityFilter = { city: cityDoc._id };
        }
    }

    const [movies, events, restaurants, stores, activities] = await Promise.all([
        Movie.find(searchQuery).limit(5).lean(),
        Event.find({ ...searchQuery, ...cityFilter }).populate('city venue').limit(5).lean(),
        Restaurant.find({ ...searchQuery, ...cityFilter }).populate('city venue').limit(5).lean(),
        Store.find({ ...searchQuery, ...cityFilter }).populate('city venue').limit(5).lean(),
        Activity.find({ ...searchQuery, ...cityFilter }).populate('city venue').limit(5).lean()
    ]);

    res.json({
        movies,
        events,
        restaurants,
        stores,
        activities,
        total: movies.length + events.length + restaurants.length + stores.length + activities.length
    });
});

module.exports = {
    globalSearch
};
