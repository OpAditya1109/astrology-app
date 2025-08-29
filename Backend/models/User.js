const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dob: Date,
  birthTime: String,
  birthPlace: String,
  kundlis: [Object],

  // New role field with default
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: String,
        paymentId: String, // For reference from Razorpay
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
