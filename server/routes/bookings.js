const express = require('express');
const router = express.Router();
const { createBooking, verifyPayment, getUserBookings, getBookedSeats } = require('../controllers/bookingController');

router.post('/', createBooking);
router.post('/verify-payment', verifyPayment);
router.get('/user/:userId', getUserBookings);
router.get('/booked-seats', getBookedSeats);

module.exports = router;
