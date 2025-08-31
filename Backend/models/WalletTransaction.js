const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, paid, failed, cancelled
  paymentId: String,
  paymentMethod: String,
  paymentTime: String,
  bankReference: String,
  paymentMessage: String
}, { timestamps: true });

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
