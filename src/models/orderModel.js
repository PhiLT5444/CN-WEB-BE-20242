// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  transactionId: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);