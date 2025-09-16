const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");

const router = express.Router();

// ✅ Middleware to check admin
function verifyAdmin(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    if (decoded.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    req.adminId = decoded.id;
    next();
  });
}

// ✅ Admin Dashboard Stats
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const astrologersCount = await Astrologer.countDocuments();
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      usersCount,
      astrologersCount,
      latestUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
