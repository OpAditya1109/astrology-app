const express = require("express");
const { registerAstrologer } = require("../controllers/astrologerController");
const router = express.Router();
const multer = require("multer");

// Use memory storage (no saving on disk, we'll directly upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Register Astrologer with profile photo upload
router.post("/register", upload.single("photo"), registerAstrologer);

module.exports = router;
