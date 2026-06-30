const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true, unique: true }, // our internal receipt ID
  razorpayOrderId: { type: String, sparse: true },         // Razorpay's order ID (for webhook lookup)
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },            // pending, paid, failed, cancelled
  paymentId: { type: String, unique: true, sparse: true }, // Razorpay payment ID
  paymentMethod: String,
  paymentTime: String,
  bankReference: String,
  paymentMessage: String,
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);