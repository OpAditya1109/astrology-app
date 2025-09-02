const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");

const router = express.Router();

// ✅ LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Astrologer.findOne({ email });
      role = "astrologer";
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

 res.json({
  token,
  user: {
    id: user._id,
    email: user.email,
    role,
    birthTime: user.birthTime,
    birthPlace: user.birthPlace,
    dob: user.dob,
  },
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
