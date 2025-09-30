const mongoose = require("mongoose");

const refundLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  consultationId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RefundLog", refundLogSchema);
