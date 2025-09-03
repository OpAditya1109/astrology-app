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

    const query = {};

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
  .select("name experience languagesKnown categories systemsKnown city country photo");
      // Only return relevant fields

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

module.exports = router;
