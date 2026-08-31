const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, seedProducts } = require('../controllers/shop.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.route('/products')
  .get(getProducts)
  .post(protect, upload.single('image'), createProduct);

router.route('/products/:id')
  .get(getProductById)
  .put(protect, upload.single('image'), updateProduct)
  .delete(protect, deleteProduct);

router.route('/seed').post(seedProducts);

module.exports = router;

