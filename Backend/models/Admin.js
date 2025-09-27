const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
  name: { type: String, default: "Admin" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" }, // ✅ role field
remainingTime: { type: String, default: "00:00" },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: String,
        referenceId: String,
      },
    ],
  },
});


module.exports = mongoose.model("Admin", adminSchema);
