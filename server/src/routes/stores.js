const express = require('express');
const router = express.Router();
const { getStores, createStores, getStoreById } = require('../controllers/storeController');

router.route('/').get(getStores).post(createStores);
router.route('/:id').get(getStoreById);

module.exports = router;
