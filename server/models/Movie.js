const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    city: { type: [String], default: [] }, // Array of city slugs
    description: { type: String },
    language: { type: String }, // e.g., "Hindi, English"
    genre: { type: [String] }, // e.g., ["Action", "Drama"]
    duration: { type: Number }, // in minutes
    releaseDate: { type: Date },
    poster: { type: String }, // Vertical poster
    backdrop: { type: String }, // Horizontal banner
    rating: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    certificate: { type: String, enum: ['U', 'U/A', 'A', 'S'], default: 'U/A' },
    trailerUrl: { type: String },
    cast: [{
        name: String,
        role: String,
        image: String
    }]
}, { timestamps: true });

movieSchema.index({ title: 1, releaseDate: 1 }, { unique: true });

module.exports = mongoose.model('Movie', movieSchema);
