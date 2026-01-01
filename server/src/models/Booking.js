const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Clerk ID
    email: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Movie or Event ID
    entityType: { type: String, enum: ['Movie', 'Event'], required: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }, // Optional if inherent
    date: { type: Date },
    seats: [String], // ["3-4", "3-5"]
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
