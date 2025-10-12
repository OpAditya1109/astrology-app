const express = require("express");
const router = express.Router();
const Astrologer = require("../models/Astrologer");
const Review = require("../models/Review");

// GET /api/Consult-astrologers
router.get("/", async (req, res) => {
  try {
    const {
      name,
      experience,
      language,
      category,
      systems, // optional filter
      isAI, // 👈 new query flag
      page = 1,
      limit = 6,
    } = req.query;

    const query = { isVerified: true };

    // ✅ Optional: Filter only AI astrologers if requested
    if (isAI === "true") query.isAI = true;

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
      .select(
        "name experience languagesKnown categories systemsKnown city country photo online rates isAI"
      );

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
      isVerified: true,
    }).select(
      "name email experience languagesKnown categories systemsKnown city country photo rates online description totalChatTime totalVideoTime totalAudioTime isAI"
    );

    if (!astrologer)
      return res
        .status(404)
        .json({ error: "Astrologer not found or not verified" });

    const reviews = await Review.find({ astrologerId: astrologer._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ ...astrologer.toObject(), reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET astrologer talk time using id
router.get("/session/:id", async (req, res) => {
  try {
    const astrologerId = req.params.id;
    const astrologer = await Astrologer.findOne({
      _id: astrologerId,
      isVerified: true,
    }).select("totalChatTime totalVideoTime totalAudioTime");

    if (!astrologer) {
      return res.status(404).json({ error: "Astrologer not found" });
    }

    res.json({
      chat: astrologer.totalChatTime || "00:00",
      video: astrologer.totalVideoTime || "00:00",
      audio: astrologer.totalAudioTime || "00:00",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
