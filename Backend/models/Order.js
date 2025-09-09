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

    // Additional fields from order form
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
