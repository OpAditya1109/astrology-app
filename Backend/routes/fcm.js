// Backend/routes/fcm.js
const express = require("express");
const router = express.Router();
const Astrologer = require("../models/Astrologer"); // your astrologer model
const User = require("../models/User"); // your user model
const admin = require("../firebaseAdmin"); // your firebase admin instance
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





router.post("/send-notification", async (req, res) => {
  console.log("Messaging function:", typeof admin.messaging);

  try {
    const { title, body } = req.body;
    const users = await User.find({ fcmToken: { $ne: null } });
    const tokens = users.map(u => u.fcmToken);

    if (tokens.length === 0) {
      return res.status(400).json({ message: "No FCM tokens found" });
    }

    const BATCH_SIZE = 500;
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      const response = await admin.messaging().sendMulticast({
        notification: { title, body },
        tokens: batch
      });
      successCount += response.successCount;
      failureCount += response.failureCount;
    }

    res.json({ message: "Notifications sent to users", successCount, failureCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
