const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String }, // e.g., "Fashion", "Electronics", "Books"
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    image: { type: String },
    website: { type: String },
    contactNumber: { type: String },
    operatingHours: { type: String },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
