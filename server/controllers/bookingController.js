const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const User = require('../models/User'); // Import User model
const asyncHandler = require('../middleware/asyncHandler');
const { sendBookingConfirmation } = require('../utils/emailService');
const Movie = require('../models/Movie');
const Event = require('../models/Event');
const Restaurant = require('../models/Restaurant');
const Store = require('../models/Store');
const Activity = require('../models/Activity');

const getEntityModel = (type) => {
    switch (type) {
        case 'Movie': return Movie;
        case 'Event': return Event;
        case 'Restaurant': return Restaurant;
        case 'Store': return Store;
        case 'Activity': return Activity;
        default: return null;
    }
};

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_DUMMY_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'DUMMY_KEY_SECRET'
});

// @desc    Create a booking with payment order
// @route   POST /api/bookings
// @access  Private (Public for now)
const createBooking = asyncHandler(async (req, res) => {
    const { userId, email, entityId, entityType, venueId, date, showTime, screenName, seats, quantity, totalAmount } = req.body;

    // Validate required fields
    if (!userId || !email || !entityId || !entityType || !totalAmount) {
        res.status(400);
        throw new Error('Missing required booking fields');
    }

    // Check if any of the seats are already booked for movies
    if (entityType === 'Movie') {
        if (!seats || seats.length === 0) {
            res.status(400);
            throw new Error('Seats are required for movie bookings');
        }
        
        const existingBookings = await Booking.find({
            entityId,
            venueId,
            date,
            showTime,
            screenName,
            status: 'confirmed',
            seats: { $in: seats }
        });

        if (existingBookings.length > 0) {
            res.status(400);
            throw new Error('One or more selected seats are already booked');
        }
    }

    // Create Razorpay order
    const options = {
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
            userId,
            entityType,
            entityId
        }
    };

    let order;
    try {
        order = await razorpay.orders.create(options);
    } catch (razorpayErr) {
        res.status(500);
        throw new Error(`Razorpay error: ${razorpayErr.message}`);
    }

    // Build booking object with only relevant fields
    const bookingData = {
        userId,
        email,
        entityId,
        entityType,
        venueId,
        date,
        quantity: quantity || 1,
        totalAmount,
        paymentOrderId: order.id,
        status: 'pending',
        paymentStatus: 'pending'
    };

    // Add movie-specific fields only if it's a movie booking
    if (entityType === 'Movie') {
        bookingData.showTime = showTime;
        bookingData.screenName = screenName;
        bookingData.seats = seats;
    }

    // Create booking in pending state
    const booking = await Booking.create(bookingData);

    res.status(201).json({
        booking,
        order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency
        }
    });
});

// @desc    Verify payment and update booking
// @route   POST /api/bookings/verify-payment
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'DUMMY_KEY_SECRET')
        .update(body.toString())
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    // Update booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (isValid) {
        booking.paymentId = razorpay_payment_id;
        booking.paymentSignature = razorpay_signature;
        booking.paymentStatus = 'completed';
        booking.status = 'confirmed';
        await booking.save();

        // Populate booking for the response
        const populatedBooking = await Booking.findById(booking._id)
            .populate('venueId')
            .populate('entityId');

        // Send confirmation email asynchronously
        try {
            const venue = populatedBooking.venueId;
            const EntityModel = getEntityModel(populatedBooking.entityType);
            const entity = populatedBooking.entityId;

            // Fetch user to get the name
            const user = await User.findOne({ clerkId: booking.userId });
            const userName = user ? user.firstName : 'User';

            if (entity) {
                await sendBookingConfirmation(populatedBooking, entity, venue, userName);
            }
        } catch (emailErr) {
            console.error('Email preparation error:', emailErr);
        }

        res.json({ success: true, booking: populatedBooking });
    } else {
        booking.paymentStatus = 'failed';
        booking.status = 'failed';
        await booking.save();

        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
});

// @desc    Get bookings for a user
// @route   GET /api/bookings/user/:userId
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.params.userId })
        .populate('venueId')
        .populate('entityId')
        .sort({ createdAt: -1 });
    res.json(bookings);
});

// @desc    Get booked seats for a specific show
// @route   GET /api/bookings/booked-seats
// @access  Public
const getBookedSeats = asyncHandler(async (req, res) => {
    const { entityId, venueId, date, showTime, screenName } = req.query;

    const query = {
        entityId,
        venueId,
        date,
        showTime,
        status: 'confirmed'
    };

    if (screenName) {
        query.screenName = screenName;
    }

    const bookings = await Booking.find(query);

    const bookedSeats = bookings.reduce((acc, booking) => {
        return acc.concat(booking.seats);
    }, []);

    res.json(bookedSeats);
});

module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings,
    getBookedSeats
};
