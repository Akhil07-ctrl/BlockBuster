const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Public for now)
const createBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
});

// @desc    Get bookings for a user
// @route   GET /api/bookings/user/:userId
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
});

module.exports = {
    createBooking,
    getUserBookings
};
