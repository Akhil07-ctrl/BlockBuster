const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String }, // e.g., "Concert", "Festival", "Conference", "Exhibition"
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    date: { type: Date },
    price: { type: Number, required: true },
    image: { type: String },
    artist: { type: String }, // For concerts/shows
    organizer: { type: String },
    tags: [String]
}, { timestamps: true });

eventSchema.index({ title: 1, venue: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Event', eventSchema);
