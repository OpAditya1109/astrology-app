const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");

// ➤ Create a new consultation (chat/audio/video)
// ➤ Create a new consultation (chat/audio/video) or return existing
router.post("/", async (req, res) => {
  try {
    const { userId, userName, astrologerId, topic, mode } = req.body;

    // Check if consultation already exists between user & astrologer
    const existing = await Consultation.findOne({ userId, astrologerId });
    if (existing) {
      return res.status(200).json(existing); // return existing room
    }

    // Create new consultation if none exists
    const consultation = new Consultation({
      userId,
      astrologerId,
      topic,
      mode,
      bookedAt: new Date(),
      messages: [],
    });

    await consultation.save();

    // --- EMIT SOCKET EVENT ---
    const io = req.app.get("io"); // Make sure you attached io in server.js
    io.to(astrologerId.toString()).emit("newConsultation", {
      _id: consultation._id,
      userId,
      userName,       // send user's name so frontend can show notification
      topic,
      bookedAt: consultation.bookedAt,
    });

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create consultation" });
  }
});


// ➤ Get all consultations for an astrologer
router.get("/:astrologerId", async (req, res) => {
  try {
    const consultations = await Consultation.find({
      astrologerId: req.params.astrologerId,
    })
      .populate("userId", "name email dob")
      .sort({ bookedAt: -1 });

    res.json(consultations);
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

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
});

// ➤ Add a new message to consultation
router.post("/:consultationId/messages", async (req, res) => {
  try {
    const { sender, text } = req.body;

    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Push message into consultation.messages
    consultation.messages.push({ sender, text });
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
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json(consultation.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});
// DELETE consultation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Consultation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json({ message: "Consultation ended and deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
