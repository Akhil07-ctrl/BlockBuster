const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    // Optional: Coordinates for distance calc later
    lat: Number,
    lng: Number
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
