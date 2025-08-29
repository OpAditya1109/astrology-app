const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Add funds after successful payment
router.post("/add-funds", async (req, res) => {
  try {
    const { userId, amount, paymentId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update wallet balance
    user.wallet.balance += Number(amount);

    // Add transaction record
    user.wallet.transactions.push({
      type: "credit",
      amount: Number(amount),
      description: "Wallet top-up",
      paymentId,
    });

    await user.save();

    res.json({ message: "Wallet updated successfully", balance: user.wallet.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
