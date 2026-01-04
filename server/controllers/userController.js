const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const Movie = require('../models/Movie');
const Event = require('../models/Event');
const Restaurant = require('../models/Restaurant');
const Store = require('../models/Store');
const Activity = require('../models/Activity');

// @desc    Sync user from Clerk
// @route   POST /api/users/sync
// @access  Public
const syncUser = asyncHandler(async (req, res) => {
    const { clerkId, email, firstName, lastName } = req.body;
    let user = await User.findOne({ clerkId });

    if (user) {
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();
        return res.json(user);
    }

    user = await User.create({ clerkId, email, firstName, lastName });
    res.status(201).json(user);
});

// @desc    Get user profile
// @route   GET /api/users/:clerkId
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    res.json(user);
});

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/toggle
// @access  Public (should be protected in production)
const toggleWishlist = asyncHandler(async (req, res) => {
    const { clerkId, itemId, itemType } = req.body;
    let user = await User.findOne({ clerkId });

    if (!user) {
        // If user not found (e.g., sync hasn't happened yet), create user
        // We'll use a placeholder email since we don't have it here, 
        // but it will be updated by syncUser soon.
        user = await User.create({ 
            clerkId, 
            email: 'placeholder@temporary.com', // Will be updated by sync
            wishlist: [] 
        });
    }

    const itemIndex = user.wishlist.findIndex(
        (item) => item.itemId.toString() === itemId && item.itemType === itemType
    );

    let message = '';
    if (itemIndex > -1) {
        user.wishlist.splice(itemIndex, 1);
        message = 'Removed from Hotlist';
    } else {
        user.wishlist.push({ itemId, itemType });
        message = 'Added to Hotlist';
    }

    await user.save();
    res.json({ wishlist: user.wishlist, message });
});

// @desc    Get user wishlist with populated items
// @route   GET /api/users/wishlist/:clerkId
// @access  Public
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) {
        return res.json([]);
    }

    // Manual population because itemId ref is dynamic
    const populatedWishlist = await Promise.all(
        user.wishlist.map(async (item) => {
            let details = null;
            switch (item.itemType) {
                case 'Movie': details = await Movie.findById(item.itemId); break;
                case 'Event': details = await Event.findById(item.itemId); break;
                case 'Restaurant': details = await Restaurant.findById(item.itemId); break;
                case 'Store': details = await Store.findById(item.itemId); break;
                case 'Activity': details = await Activity.findById(item.itemId); break;
            }
            return { ...item._doc, details };
        })
    );

    res.json(populatedWishlist.filter(item => item.details !== null));
});

module.exports = {
    syncUser,
    getUserProfile,
    toggleWishlist,
    getWishlist
};
