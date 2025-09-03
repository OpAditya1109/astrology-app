const User = require("../models/User");
const Astrologer = require("../models/Astrologer"); // needed for uniqueness check
const bcrypt = require("bcryptjs");

// Register new user with email uniqueness across both collections
const registerUser = async (req, res) => {
  try {
    const { name, email,mobile, password, dob, birthTime, birthPlace } = req.body;

    // Check if email exists in User OR Astrologer
    const existingUser = await User.findOne({ email });
    const existingAstrologer = await Astrologer.findOne({ email });
    if (existingUser || existingAstrologer) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      dob,
      birthTime,
      birthPlace,
      kundlis: [],
    });

    await user.save();

    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser };
