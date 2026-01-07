const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    cuisine: { type: [String] }, // e.g., ["Italian", "Indian"]
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
    rating: { type: Number, default: 0 },
    image: { type: String },
    menu: { type: String }, // URL to menu
    contactNumber: { type: String },
    operatingHours: { type: String },
    tags: [String]
}, { timestamps: true });

restaurantSchema.index({ title: 1, venue: 1 }, { unique: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
