const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true }, // our internal receipt ID
    razorpayOrderId: { type: String, sparse: true },         // Razorpay's order ID (for webhook lookup)
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentId: String,
    paymentMethod: String,
    paymentTime: Date,

    // Delivery form fields
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);