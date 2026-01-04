const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile, toggleWishlist, getWishlist } = require('../controllers/userController');

router.post('/sync', syncUser);
router.post('/wishlist/toggle', toggleWishlist);
router.get('/wishlist/:clerkId', getWishlist);
router.get('/:clerkId', getUserProfile);

module.exports = router;
