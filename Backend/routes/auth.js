const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const Admin = require("../models/Admin");

const router = express.Router();

// ✅ Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP details
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ LOGIN API (your existing code)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "user";

    if (!user) {
      user = await Astrologer.findOne({ email });
      role = "astrologer";
    }
    if (!user) {
      user = await Admin.findOne({ email });
      role = "admin";
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    let kundaliUrl = null;
    if (user.kundlis && user.kundlis.length > 0) {
      kundaliUrl = user.kundlis[user.kundlis.length - 1].url;
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role,
        birthTime: user.birthTime,
        birthPlace: user.birthPlace,
        dob: user.dob,
        kundaliUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    let user =
      (await User.findOne({ email })) ||
      (await Astrologer.findOne({ email })) ||
      (await Admin.findOne({ email }));

    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user =
      (await User.findById(decoded.id)) ||
      (await Astrologer.findById(decoded.id)) ||
      (await Admin.findById(decoded.id));

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
