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

// @desc    Create new product
// @route   POST /api/v1/shop/products
// @access  Protected/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image, isPrescriptionRequired } = req.body;
    let imagePath = image || '/images/food.jpg';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      description: description || 'High quality pet product.',
      price: Number(price) || 0,
      category: category || 'Food',
      stock: Number(stock) || 0,
      image: imagePath,
      rating: 5.0,
      reviewsCount: 1,
      isPrescriptionRequired: isPrescriptionRequired === 'true' || isPrescriptionRequired === true
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/v1/shop/products/:id
// @access  Protected/Admin
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateFields = { ...req.body };
    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/shop/products/:id
// @access  Protected/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product removed' });
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
      { name: 'Premium Salmon Kibble', description: 'High protein nutrition for healthy dogs.', price: 45.99, category: 'Food', stock: 50, image: '/images/food.jpg', rating: 4.8, reviewsCount: 12 },
      { name: 'Orthopedic Pet Bed', description: 'Memory foam bed for ultimate joint support.', price: 89.99, category: 'Accessories', stock: 15, image: '/images/bed.jpg', rating: 4.5, reviewsCount: 8 },
      { name: 'Flea & Tick Treatment', description: 'Fast acting monthly preventative.', price: 29.99, category: 'Health', stock: 100, image: '/images/meds.jpg', rating: 4.9, reviewsCount: 45, isPrescriptionRequired: false },
      { name: 'Interactive Laser Toy', description: 'Automatic multi-angle laser toy for cats.', price: 24.99, category: 'Toys', stock: 30, image: '/images/toy.jpg', rating: 4.2, reviewsCount: 22 },
      { name: 'Tropical Bird Seed Mix', description: 'Nutrient-rich seed and fruit blend for parrots and cockatiels.', price: 18.50, category: 'Birds', stock: 40, image: '/images/signup-bird.jpg', rating: 4.9, reviewsCount: 15 },
      { name: 'Bird Playground Stand', description: 'Interactive wooden perch with ladder and swing.', price: 34.99, category: 'Birds', stock: 20, image: '/images/signup-bird.jpg', rating: 4.7, reviewsCount: 9 },
      { name: 'Crunchy Dental Chews', description: 'Keeps teeth clean and breath fresh.', price: 15.99, category: 'Food', stock: 75, image: '/images/shop-chews.jpg', rating: 4.6, reviewsCount: 31 },
      { name: 'Multivitamin Supplement Powder', description: 'Essential daily vitamins and minerals.', price: 22.00, category: 'Health', stock: 60, image: '/images/shop-supplements.jpg', rating: 4.8, reviewsCount: 18 }
    ];
    await Product.insertMany(sampleProducts);
    res.status(201).json({ success: true, message: 'Seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts };

