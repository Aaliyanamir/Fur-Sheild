const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all products (with optional category filter)
// @route   GET /api/v1/shop/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const query = req.query.category && req.query.category !== 'All' 
      ? { category: req.query.category } 
      : {};
      
    const products = await Product.find(query);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process checkout and create order
// @route   POST /api/v1/shop/checkout
// @access  Private (Any authenticated user)
const processCheckout = async (req, res) => {
  try {
    const { cartItems, shippingAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Calculate totals (in a real app, you'd re-verify prices against the DB)
    let subtotal = 0;
    const orderItems = cartItems.map(item => {
      const price = item.isAutoShip ? item.price * 0.9 : item.price;
      subtotal += price * item.quantity;
      return {
        productId: item.id || item._id, // Support different mock frontend structures temporarily
        quantity: item.quantity,
        priceAtPurchase: price,
        isAutoShip: item.isAutoShip || false
      };
    });

    const tax = subtotal * 0.08; // 8% mock tax
    const shipping = subtotal >= 49 ? 0 : 5.99;
    const totalAmount = subtotal + tax + shipping;

    const order = await Order.create({
      ownerId: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      totalAmount,
      shippingAddress: shippingAddress || { street: '123 Mock St', city: 'Karachi', state: 'Sindh', zip: '75000' }
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/v1/shop/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ ownerId: req.user.id })
      .populate('items.productId', 'name category imageUrl rxRequired')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, processCheckout, getMyOrders };
