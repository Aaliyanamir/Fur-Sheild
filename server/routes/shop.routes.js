const express = require('express');
const router = express.Router();
const { getProducts, processCheckout, getMyOrders } = require('../controllers/shop.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public route
router.get('/products', getProducts);

// Protected routes (Requires valid JWT)
router.post('/checkout', protect, processCheckout);
router.get('/orders', protect, getMyOrders);

module.exports = router;
