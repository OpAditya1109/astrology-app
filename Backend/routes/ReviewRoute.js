const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { consultationId, astrologerId, userId, rating, feedback } = req.body;
    if (!consultationId || !astrologerId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReview = new Review({ consultationId, astrologerId, userId, rating, feedback });
    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;
