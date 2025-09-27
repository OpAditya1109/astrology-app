const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const { creditAdminWallet } = require("../controllers/adminController");
const sendEmail = require("../utils/email");

// helper → format seconds into mm:ss
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ➤ Create a new consultation
router.post("/", async (req, res) => {
  try {
    const { userId, userName, astrologerId, topic, mode, rate, kundaliUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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

    await creditAdminWallet({
      amount: first5MinCost,
      description: `First 5 min payment from ${user.name}`,
      referenceId: astrologerId,
    });

    let consultation = await Consultation.findOne({ userId, astrologerId });
    if (!consultation) {
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
        totalTalkSeconds: 0, // default
      });
      await consultation.save();
    }

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
      talkTime: formatDuration(consultation.totalTalkSeconds), // send mm:ss
    });

    res.status(201).json({
      ...consultation.toObject(),
      talkTime: formatDuration(consultation.totalTalkSeconds),
    });
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
      talkTime: formatDuration(c.totalTalkSeconds || 0), // formatted clock
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
      talkTime: formatDuration(consultation.totalTalkSeconds || 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
});

// ➤ Add a new message
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

// ➤ Get all messages
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

module.exports = router;
