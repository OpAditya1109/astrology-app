const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  email: { type: String, unique: true, required: true },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: String,
        referenceId: String, // Optional: store consultation or user ID
      },
    ],
  },
});

module.exports = mongoose.model("Admin", adminSchema);
