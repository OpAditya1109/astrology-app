// Backend/routes/fcm.js
const express = require("express");
const router = express.Router();
const Astrologer = require("../models/Astrologer"); // your astrologer model
const User = require("../models/User"); // your user model

/**
 * Save FCM token for astrologer or user
 * Pass either astrologerId or userId in the request body
 */
router.post("/save-fcm-token", async (req, res) => {
  try {
    const { astrologerId, userId, token } = req.body;

    if (!token || (!astrologerId && !userId)) {
      return res.status(400).json({ message: "Token and either astrologerId or userId required" });
    }

    if (astrologerId) {
      await Astrologer.findByIdAndUpdate(astrologerId, { fcmToken: token });
    } else if (userId) {
      await User.findByIdAndUpdate(userId, { fcmToken: token });
    }

    res.json({ message: "FCM token saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
