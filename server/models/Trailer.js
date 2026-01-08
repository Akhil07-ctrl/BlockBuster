const mongoose = require('mongoose');

const trailerSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Official Trailer'
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Trailer', trailerSchema);
