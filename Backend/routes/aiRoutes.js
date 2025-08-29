const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const Astrologer = require("../models/Astrologer");
const { getAstrologyResponse } = require("../api/astrology.js"); // use import if using ES module

router.post("/start/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find AI astrologer
    const aiAstrologer = await Astrologer.findOne({ isAI: true });
    if (!aiAstrologer) return res.status(404).json({ error: "AI Astrologer not found" });

    // Check existing consultation
    const existing = await Consultation.findOne({ userId, astrologerId: aiAstrologer._id });
    if (existing) return res.status(200).json(existing);

    // Create new consultation
    const consultation = new Consultation({
      userId,
      astrologerId: aiAstrologer._id, // must be valid
      topic: "AI Astrologer Chat",
      mode: "Chat", // make sure "chat" is in schema enum
      bookedAt: new Date(),
      messages: [],
    });

    await consultation.save();
    res.status(201).json(consultation);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start AI consultation" });
  }
});


// ➤ Send message to AI
router.post("/ask-ai/:consultationId", async (req, res) => {
  try {
    const { message } = req.body;
    const { consultationId } = req.params;

    const aiReply = await getAstrologyResponse(message);

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    consultation.messages.push({ sender: "user", text: message });
    consultation.messages.push({ sender: "AI Astrologer", text: aiReply });

    await consultation.save();

    res.json({ reply: aiReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    // Find AI astrologer
    const aiAstrologer = await Astrologer.findOne({ isAI: true })
      .select("name experience languagesKnown categories systemsKnown city country isAI");

    if (!aiAstrologer) {
      return res.status(404).json({ error: "AI Astrologer not found" });
    }

    res.json({ astrologer: aiAstrologer });
  } catch (error) {
    console.error("Error fetching AI astrologer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
