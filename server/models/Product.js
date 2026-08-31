const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, enum: ['Food', 'Health', 'Toys', 'Accessories', 'Birds'] },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  reviewsCount: { type: Number, required: true, default: 0 },
  isPrescriptionRequired: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
