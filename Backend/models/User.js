const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: { type: String, unique: true },
  dob: Date,
  birthTime: String,
  birthPlace: String,
  kundlis: [Object],

  // City with latitude and longitude
  city: {
    name: String,       // e.g., "Pune"
    lat: Number,        // e.g., 18.516726
    lon: Number,        // e.g., 73.856255
  },

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
        paymentId: String,
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
