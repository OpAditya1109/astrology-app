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

module.exports = router;
