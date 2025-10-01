// Backend/routes/fcm.js
const express = require("express");
const router = express.Router();
const Astrologer = require("../models/Astrologer"); // your astrologer model

router.post("/save-fcm-token", async (req, res) => {
  try {
    const { astrologerId, token } = req.body;
    if (!astrologerId || !token) {
      return res.status(400).json({ message: "Astrologer ID and token required" });
    }

    // Save token in DB (or update if exists)
    await Astrologer.findByIdAndUpdate(astrologerId, { fcmToken: token });

    res.json({ message: "FCM token saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
