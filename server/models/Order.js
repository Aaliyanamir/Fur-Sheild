const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
    isAutoShip: { type: Boolean, default: false }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  trackingNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
