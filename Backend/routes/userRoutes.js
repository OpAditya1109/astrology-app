const express = require("express");
const { registerUser } = require("../controllers/userController");
const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// (Optional) Login route for later


module.exports = router;
