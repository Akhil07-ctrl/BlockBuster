const express = require('express');
const router = express.Router();
const { getStores, createStores, getStoreById } = require('../controllers/storeController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getStores).post(adminAuth, createStores);
router.route('/:id').get(getStoreById);

module.exports = router;
