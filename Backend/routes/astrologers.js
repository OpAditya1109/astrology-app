const express = require("express");
const router = express.Router();
const Astrologer = require("../models/Astrologer");

// GET /api/astrologers
router.get("/", async (req, res) => {
  try {
    const {
      name,
      experience,
      language,
      category,
      systems, // optional filter by systemsKnown
      page = 1,
      limit = 6,
    } = req.query;

    const query = { isVerified: true }; // ✅ only verified astrologers

    if (name) query.name = { $regex: name, $options: "i" };
    if (experience) query.experience = { $gte: Number(experience) };
    if (language) query.languagesKnown = { $in: [language] };
    if (category) query.categories = { $in: [category] };
    if (systems) query.systemsKnown = { $in: [systems] };

    const skip = (page - 1) * limit;
    const total = await Astrologer.countDocuments(query);

    const astrologers = await Astrologer.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ experience: -1 })
      .select("name experience languagesKnown categories systemsKnown city country photo online rates");

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      astrologers,
    });
  } catch (error) {
    console.error("Error fetching astrologers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update rates & online status
router.put("/update-rates-online/:id", async (req, res) => {
  try {
    const { rates, online } = req.body;
    const astrologer = await Astrologer.findByIdAndUpdate(
      req.params.id,
      { rates, online },
      { new: true }
    );
    res.json(astrologer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single astrologer
router.get("/:id", async (req, res) => {
  try {
    const astrologer = await Astrologer.findOne({
      _id: req.params.id,
      isVerified: true, // ✅ only verified astrologer
    }).select("name email experience languagesKnown categories systemsKnown city country photo rates online description");

    if (!astrologer) return res.status(404).json({ error: "Astrologer not found or not verified" });
    res.json(astrologer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// GET astrologer from session
// GET astrologer talk time using id from frontend
router.get("/session/:id", async (req, res) => {
  try {
    const astrologerId = req.params.id;

    const astrologer = await Astrologer.findOne({
      _id: astrologerId,
      isVerified: true,
    }).select("totalTalkTime");

    if (!astrologer) {
      return res.status(404).json({ error: "Astrologer not found" });
    }

    res.json({
      chat: res.data.totalChatTime || "00:00",
      video: res.data.totalVideoTime || "00:00",
      audio: res.data.totalAudioTime || "00:00",
    
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
