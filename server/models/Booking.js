const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk User ID
    email: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entityType', required: true },
    entityType: { type: String, enum: ['Movie', 'Event', 'Restaurant', 'Store', 'Activity'], required: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    date: { type: Date },
    showTime: { type: String }, // Show time for movies
    screenName: { type: String }, // Screen name for movies
    seats: [String], // For movies (e.g., ["A1", "A2"])
    quantity: { type: Number, default: 1 }, // For events/restaurants/activities
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'failed', 'cancelled'], default: 'pending' },

    // Payment Details
    paymentId: { type: String },
    paymentOrderId: { type: String },
    paymentSignature: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String }
}, { timestamps: true });

// Ensure unique payment order ID to prevent duplicate bookings for the same payment
bookingSchema.index({ paymentOrderId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Booking', bookingSchema);
