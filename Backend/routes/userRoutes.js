const express = require("express");
const { registerUser } = require("../controllers/userController");
const User = require("../models/User");

const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// (Optional) Login route for later
router.get("/:id/details", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name dob birthTime birthPlace wallet"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      dob: user.dob,
      birthTime: user.birthTime,
      birthPlace: user.birthPlace,
      wallet: user.wallet,   // ✅ now balance + transactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/userRoutes.js
router.get("/profile", async (req, res) => {
  try {
    const userId = req.user.id; // e.g. from session or JWT
    const user = await User.findById(userId).select("name dob birthTime birthPlace");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/deduct", async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware required
    const { amount, consultationId } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Deduct balance
    user.wallet.balance -= amount;
    // Add transaction history
    user.wallet.transactions.push({
      type: "debit",
      amount,
      date: new Date(),
      consultationId: consultationId || null,
    });

    await user.save();

    res.json({ balance: user.wallet.balance, transactions: user.wallet.transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
