const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

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
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    syncUser,
    getUserProfile
};
