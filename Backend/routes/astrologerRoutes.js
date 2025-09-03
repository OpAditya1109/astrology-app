const express = require("express");
const multer = require("multer");
const { registerAstrologer } = require("../controllers/astrologerController");

const router = express.Router();

// Use memory storage so file is available in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", upload.single("photo"), registerAstrologer);

module.exports = router;
