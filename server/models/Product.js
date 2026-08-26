const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'] },
  category: { 
    type: String, 
    enum: ['PRESCRIPTIONS', 'SUPPLEMENTS', 'NUTRITION', 'ACCESSORIES'],
    required: true,
    index: true
  },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  rxRequired: { type: Boolean, default: false },
  imageUrl: { type: String },
  autoShipEligible: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
