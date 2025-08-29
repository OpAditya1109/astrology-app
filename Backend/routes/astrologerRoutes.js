const express = require("express");
const { registerAstrologer } = require("../controllers/astrologerController");
const router = express.Router();

router.post("/register", registerAstrologer);


module.exports = router;
