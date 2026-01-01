const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String }, // e.g., "Adventure", "Sports", "Workshop", "Tour"
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    duration: { type: String }, // e.g., "2 hours", "Full Day"
    price: { type: Number, required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], default: 'Easy' },
    image: { type: String },
    inclusions: [String], // What's included in the activity
    requirements: [String], // Age, fitness level, etc.
    date: { type: Date },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
