const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");

// -------------------------
// 1️⃣ Create UPIGateway Payment
// -------------------------
router.post("/create-payment", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // UPIGateway credentials
    const merchantId = "aditya8yadav8@oksbi";
    const apiKey = "b57222ec-a677-4314-8332-d02275b55b41";

    // Payment request payload
    const payload = {
      merchantId,
      amount: Number(amount),
      currency: "USD",
      orderId: `ORDER_${Date.now()}`,
      callbackUrl: `https://bhavanaastro.onrender.com/api/wallet/payment-webhook?userId=${userId}`, // webhook URL
    };

    // Call UPIGateway API to create payment
    const response = await axios.post(
      "https://api.upigateway.com/create-payment", // replace with actual UPIGateway endpoint
      payload,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    // Response usually contains payment link or QR code
    res.json({ paymentUrl: response.data.paymentUrl, orderId: payload.orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// -------------------------
// 2️⃣ Webhook: Payment Confirmation
// -------------------------
router.post("/payment-webhook", async (req, res) => {
  try {
    const { userId } = req.query; // from callback URL
    const { orderId, paymentId, amount, status } = req.body;

    if (status !== "success") {
      return res.status(400).json({ error: "Payment failed" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update wallet balance
    user.wallet.balance += Number(amount);

    // Add transaction record
    user.wallet.transactions.push({
      type: "credit",
      amount: Number(amount),
      description: "Wallet top-up via UPIGateway",
      paymentId,
      orderId,
    });

    await user.save();

    res.json({ message: "Wallet updated successfully", balance: user.wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
