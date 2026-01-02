const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_DUMMY_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'DUMMY_KEY_SECRET'
});

// @desc    Create a booking with payment order
// @route   POST /api/bookings
// @access  Private (Public for now)
const createBooking = asyncHandler(async (req, res) => {
    const { userId, email, entityId, entityType, venueId, date, seats, quantity, totalAmount } = req.body;

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

    const order = await razorpay.orders.create(options);

    // Create booking in pending state
    const booking = await Booking.create({
        userId,
        email,
        entityId,
        entityType,
        venueId,
        date,
        seats,
        quantity,
        totalAmount,
        paymentOrderId: order.id,
        status: 'pending',
        paymentStatus: 'pending'
    });

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

        res.json({ success: true, booking });
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
        .sort({ createdAt: -1 });
    res.json(bookings);
});

module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings
};
