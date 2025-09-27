const express = require("express");
const { registerUser } = require("../controllers/userController");
const User = require("../models/User");
const Consultation = require("../models/Consultation");

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
    // ✅ Get userId from request body
    const { userId, amount, consultationId, extendMinutes } = req.body;

    if (!userId) return res.status(401).json({ message: "User not logged in" });
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (extendMinutes && extendMinutes <= 0) return res.status(400).json({ message: "Invalid extend minutes" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.wallet.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    // Deduct wallet balance
    user.wallet.balance -= amount;
    user.wallet.transactions.push({
      type: "debit",
      amount,
      date: new Date(),
      consultationId: consultationId || null,
    });
    await user.save();

    // Extend consultation timer if needed
    let updatedTimer = null;
    if (consultationId && extendMinutes) {
      const consultation = await Consultation.findById(consultationId);
      if (consultation) {
        if (consultation.timer?.isRunning) {
          consultation.timer.durationMinutes += extendMinutes;
        } else {
          consultation.timer = { startTime: new Date(), durationMinutes: extendMinutes, isRunning: true };
        }
        await consultation.save();
        updatedTimer = consultation.timer;
      }
    }

    res.json({ balance: user.wallet.balance, transactions: user.wallet.transactions, consultationTimer: updatedTimer });
  } catch (err) {
    console.error("Deduct route error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
