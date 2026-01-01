const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    language: { type: String }, // e.g., "Hindi, English"
    genre: { type: [String] }, // e.g., ["Action", "Drama"]
    duration: { type: Number }, // in minutes
    releaseDate: { type: Date },
    poster: { type: String }, // Vertical poster
    backdrop: { type: String }, // Horizontal banner
    rating: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    certificate: { type: String, enum: ['U', 'UA', 'A', 'S'], default: 'UA' },
    trailerUrl: { type: String },
    cast: [{
        name: String,
        role: String,
        image: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
