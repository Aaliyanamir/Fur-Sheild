const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/v1/shop/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/v1/shop/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed mock products
// @route   POST /api/v1/shop/seed
// @access  Public (for dev)
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany();
    const sampleProducts = [
      { name: 'Premium Salmon Kibble', description: 'High protein dog food', price: 45.99, category: 'Food', stock: 50, image: '/images/product-placeholder.jpg', rating: 4.8, reviewsCount: 12 },
      { name: 'Orthopedic Pet Bed', description: 'Memory foam bed for large breeds', price: 89.99, category: 'Accessories', stock: 15, image: '/images/product-placeholder.jpg', rating: 4.5, reviewsCount: 8 },
      { name: 'Flea & Tick Treatment', description: 'Monthly preventative for dogs', price: 29.99, category: 'Health', stock: 100, image: '/images/product-placeholder.jpg', rating: 4.9, reviewsCount: 45, isPrescriptionRequired: false },
      { name: 'Interactive Laser Toy', description: 'Automatic laser for cats', price: 24.99, category: 'Toys', stock: 30, image: '/images/product-placeholder.jpg', rating: 4.2, reviewsCount: 22 }
    ];
    await Product.insertMany(sampleProducts);
    res.status(201).json({ success: true, message: 'Seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, seedProducts };
