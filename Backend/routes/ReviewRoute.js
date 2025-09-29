const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");

router.post("/", async (req, res) => {
  try {
    const { consultationId, astrologerId, userId, rating, feedback } = req.body;

    if (!consultationId || !astrologerId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReview = new Review({
      consultationId: mongoose.Types.ObjectId(consultationId),
      astrologerId: mongoose.Types.ObjectId(astrologerId),
      userId: mongoose.Types.ObjectId(userId),
      rating,
      feedback,
    });

    await newReview.save();

    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (err) {
    console.error("Review save error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;
