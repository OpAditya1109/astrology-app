const express = require("express");
const Enquiry = require("../models/Enquiry");

const router = express.Router();

// Save enquiry
// Save enquiry
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ message: "Enquiry stored successfully!" });
  } catch (error) {
    console.error("❌ Error saving enquiry:", error); // <-- log the error
    res.status(500).json({ message: "Error saving enquiry", error: error.message });
  }
});

// Get all enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiries", error });
  }
});

module.exports = router;
