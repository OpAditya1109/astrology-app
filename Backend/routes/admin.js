const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const Order = require("../models/Order");
const Enquiry = require("../models/Enquiry");
const WalletTransaction = require("../models/WalletTransaction"); // ✅ new import

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
    const ordersCount = await Order.countDocuments();
    const enquiriesCount = await Enquiry.countDocuments();
    const walletTxCount = await WalletTransaction.countDocuments(); // ✅

    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const latestAstrologers = await Astrologer.find().sort({ createdAt: -1 }).limit(5);
    const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const latestEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);
    const latestWalletTx = await WalletTransaction.find().sort({ createdAt: -1 }).limit(5); // ✅

    res.json({
      usersCount,
      astrologersCount,
      ordersCount,
      enquiriesCount,
      walletTxCount, // ✅
      latestUsers: latestUsers || [],
      latestAstrologers: latestAstrologers || [],
      latestOrders: latestOrders || [],
      latestEnquiries: latestEnquiries || [],
      latestWalletTx: latestWalletTx || [], // ✅
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
