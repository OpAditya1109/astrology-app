const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentId: String,
    paymentMethod: String,
    paymentTime: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
