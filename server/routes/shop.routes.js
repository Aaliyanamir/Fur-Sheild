const express = require('express');
const router = express.Router();
const { getProducts, getProductById, seedProducts } = require('../controllers/shop.controller');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getProductById);
router.route('/seed').post(seedProducts);

module.exports = router;
