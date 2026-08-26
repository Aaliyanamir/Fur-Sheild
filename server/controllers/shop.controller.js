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
    // 1. Verify User exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found in request' });
    }

    const { cartItems, shippingAddress } = req.body;

    // 2. Validate Cart Payload
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty or invalid format' });
    }

    // 3. Re-verify prices and stock against DB to prevent frontend manipulation
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const productId = item.productId || item._id || item.id;
      if (!productId) {
         return res.status(400).json({ success: false, message: 'Missing product ID in cart item' });
      }

      const dbProduct = await Product.findById(productId);
      if (!dbProduct) {
         return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      }
      if (dbProduct.stock < item.quantity) {
         return res.status(400).json({ success: false, message: `Insufficient stock for product: ${dbProduct.name}` });
      }

      const price = item.isAutoShip ? dbProduct.price * 0.9 : dbProduct.price;
      subtotal += price * item.quantity;
      
      orderItems.push({
        productId: dbProduct._id,
        quantity: item.quantity,
        priceAtPurchase: price,
        isAutoShip: item.isAutoShip || false
      });
    }

    // 4. Calculate final totals
    const tax = subtotal * 0.08; // 8% mock tax
    const shipping = subtotal >= 49 ? 0 : 5.99;
    const totalAmount = subtotal + tax + shipping;

    // 5. Create Order transaction
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
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error during checkout', error: error.message });
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

