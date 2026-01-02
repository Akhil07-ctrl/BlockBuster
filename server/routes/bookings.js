const express = require('express');
const router = express.Router();
const { createBooking, verifyPayment, getUserBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.post('/verify-payment', verifyPayment);
router.get('/user/:userId', getUserBookings);

module.exports = router;
