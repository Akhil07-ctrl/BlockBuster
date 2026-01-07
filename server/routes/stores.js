const express = require('express');
const router = express.Router();
const { getStores, createStores, getStoreById, deleteStores } = require('../controllers/storeController');
const { adminAuth } = require('../middleware/authMiddleware');

router.route('/').get(getStores).post(adminAuth, createStores).delete(adminAuth, deleteStores);
router.route('/:id').get(getStoreById);

module.exports = router;
