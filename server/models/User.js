const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    defaultCity: { type: String }, // City Slug
    wishlist: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        itemType: { type: String, required: true, enum: ['Movie', 'Event', 'Restaurant', 'Store', 'Activity'] }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
