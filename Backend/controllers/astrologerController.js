const Astrologer = require("../models/Astrologer");
const User = require("../models/User"); // needed for uniqueness check
const bcrypt = require("bcryptjs");

// Register Astrologer with email uniqueness across both collections
const registerAstrologer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      mobile,
      experience,
      city,
      country,
      systemsKnown,
      languagesKnown,
      categories,
    } = req.body;

    // Check if email exists in Astrologer OR User
    const existingAstrologer = await Astrologer.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingAstrologer || existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save astrologer
    const astrologer = new Astrologer({
      name,
      email,
      password: hashedPassword,
      gender,
      mobile,
      experience,
      city,
      country,
      systemsKnown,
      languagesKnown,
      categories,
    });

    await astrologer.save();

    res.json({ message: "Astrologer registered successfully", astrologerId: astrologer._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerAstrologer };
