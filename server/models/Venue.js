const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    type: { type: String, enum: ['Cinema', 'Arena', 'Restaurant', 'Pub', 'Other'], default: 'Other' },
    image: { type: String },
    facilities: [String]
}, { timestamps: true });

// Prevent duplicate venues in the same city
venueSchema.index({ name: 1, city: 1 }, { unique: true });

module.exports = mongoose.model('Venue', venueSchema);
