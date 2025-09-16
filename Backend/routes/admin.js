const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const Order = require("../models/Order");
const Enquiry = require("../models/Enquiry");
const WalletTransaction = require("../models/WalletTransaction");
const Admin = require("../models/Admin"); // ✅ import Admin

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
    // Counts
    const usersCount = await User.countDocuments();
    const astrologersCount = await Astrologer.countDocuments();
    const ordersCount = await Order.countDocuments();
    const enquiriesCount = await Enquiry.countDocuments();
    const walletTxCount = await WalletTransaction.countDocuments();

    // Latest records
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const latestAstrologers = await Astrologer.find().sort({ createdAt: -1 }).limit(5);
    const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const latestEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);
    const latestWalletTx = await WalletTransaction.find().sort({ createdAt: -1 }).limit(5);

    // ✅ Get admin balance and wallet transactions
    const admin = await Admin.findOne(); // assuming only 1 admin
    const adminBalance = admin?.wallet?.balance || 0;
    const adminTransactions = admin?.wallet?.transactions || [];

    res.json({
      usersCount,
      astrologersCount,
      ordersCount,
      enquiriesCount,
      walletTxCount,
      latestUsers: latestUsers || [],
      latestAstrologers: latestAstrologers || [],
      latestOrders: latestOrders || [],
      latestEnquiries: latestEnquiries || [],
      latestWalletTx: latestWalletTx || [],
      adminBalance, // ✅ include admin wallet balance
      adminTransactions, // ✅ include admin wallet transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
