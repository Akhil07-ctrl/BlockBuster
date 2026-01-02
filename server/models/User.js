const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    defaultCity: { type: String }, // City Slug
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] // Simplified
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
