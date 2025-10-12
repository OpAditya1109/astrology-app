const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const { creditAdminWallet } = require("../controllers/adminController");
const sendEmail = require("../utils/email");
const admin = require("../firebaseAdmin"); // 🔹 import Firebase Admin

// ➤ Create a new consultation
router.post("/", async (req, res) => {
  try {
    const { userId, userName, astrologerId, topic, mode, rate, kundaliUrl } = req.body;

    // 1️⃣ Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Deduct first 5 min
    const first5MinCost = rate * 5;
    if (user.wallet.balance < first5MinCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.wallet.balance -= first5MinCost;
    user.wallet.transactions.push({
      type: "debit",
      amount: first5MinCost,
      description: `First 5 min ${mode} consultation`,
    });
    await user.save();

    // 3️⃣ Credit admin wallet
    await creditAdminWallet({
      amount: first5MinCost,
      description: `First 5 min payment from ${user.name}`,
      referenceId: astrologerId,
    });

    // 4️⃣ Check if consultation exists
    let consultation = await Consultation.findOne({ userId, astrologerId });
    if (!consultation) {
      // 5️⃣ Create new consultation
      consultation = new Consultation({
        userId,
        astrologerId,
        topic,
        mode,
        bookedAt: new Date(),
        messages: [],
        status: "ongoing",
        kundaliUrl: kundaliUrl || null,
        rate: rate || 0,
      });
      await consultation.save();
    }

    // 6️⃣ Emit socket event
    const io = req.app.get("io");
    io.to(astrologerId.toString()).emit("newConsultation", {
      _id: consultation._id,
      userId,
      userName,
      topic,
      mode: consultation.mode,
      bookedAt: consultation.bookedAt,
      status: consultation.status,
      kundaliUrl: consultation.kundaliUrl,
      rate: consultation.rate,
    });

    // 7️⃣ 🔹 Send FCM notification to astrologer
    const astrologer = await Astrologer.findById(astrologerId);
    if (astrologer?.fcmToken) {
      const message = {
        token: astrologer.fcmToken,
        notification: {
          title: "New Consultation Booked",
          body: `A new ${mode} consultation has been booked by ${userName || "User"}`,
        },
        data: {
          consultationId: consultation._id.toString(),
          mode,
          userName: userName || "User",
        },
      };

      admin.messaging().send(message)
        .then((response) => console.log("FCM message sent:", response))
        .catch((err) => console.error("FCM error:", err));
    }

    // 8️⃣ Optional: send email to astrologer (commented)
    // try { ... } catch (emailErr) { console.error(emailErr); }

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create consultation" });
  }
});

// ➤ Get all consultations for an astrologer
router.get("/:astrologerId", async (req, res) => {
  try {
    const consultations = await Consultation.find({ astrologerId: req.params.astrologerId })
      .populate("userId", "name email dob")
      .sort({ bookedAt: -1 })
      .lean();

    const mapped = consultations.map(c => ({
      _id: c._id,
      userId: c.userId._id,
      userName: c.userId.name,
      topic: c.topic,
      bookedAt: c.bookedAt,
      mode: c.mode,
      status: c.status || "ongoing",
      rate: c.rate || 0,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

// ➤ Get consultation by ID (with messages)
router.get("/details/:consultationId", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate("userId", "name email dob")
      .populate("astrologerId", "name email");

    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    res.json({
      ...consultation.toObject(),
      ratePerMinute: consultation.rate,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
});

// ➤ Add a new message to consultation
router.post("/:consultationId/messages", async (req, res) => {
  try {
    const { sender, text, kundaliUrl, system } = req.body;

    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    consultation.messages.push({
      sender,
      text,
      kundaliUrl: kundaliUrl || null,
      system: system || false,
    });
    await consultation.save();

    res.status(201).json(consultation.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ➤ Get all messages of a consultation
router.get("/:consultationId/messages", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    res.json(consultation.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ➤ Delete consultation
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Consultation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Consultation not found" });

    res.json({ message: "Consultation ended and deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/ai", async (req, res) => {
  try {
    const { userId, astrologerId, rate } = req.body;

    // 1️⃣ Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Calculate cost for 5 minutes
    const totalCost = rate * 5;

    // 3️⃣ Check balance
    if (user.wallet.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 4️⃣ Deduct from user wallet
    user.wallet.balance -= totalCost;
    user.wallet.transactions.push({
      type: "debit",
      amount: totalCost,
      description: `AI Astrologer consultation (first 5 min)`,
    });
    await user.save();

    // 5️⃣ Credit admin wallet
    await creditAdminWallet({
      amount: totalCost,
      description: `AI Astrologer consultation payment from ${user.name}`,
      referenceId: astrologerId,
    });

    // 6️⃣ Return response
    res.status(200).json({
      success: true,
      message: `₹${totalCost} deducted successfully for AI astrologer consultation.`,
      newBalance: user.wallet.balance,
    });

  } catch (err) {
    console.error("AI Consultation Error:", err);
    res.status(500).json({ error: "Failed to process AI consultation payment" });
  }
});

module.exports = router;
