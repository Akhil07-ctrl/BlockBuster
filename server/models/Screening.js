const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    movie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie', 
        required: true 
    },
    city: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'City', 
        required: true 
    },
    venue: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Venue', 
        required: true 
    },
    screens: [{
        screenName: { type: String, required: true },
        language: { type: String, required: true },
        formats: [String],
        price: { type: Number, required: true },
        shows: [String]
    }]
}, { timestamps: true });

// Ensure a venue doesn't have duplicate screening entries for the same movie
screeningSchema.index({ movie: 1, venue: 1 }, { unique: true });

module.exports = mongoose.model('Screening', screeningSchema);
