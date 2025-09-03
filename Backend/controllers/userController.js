const User = require("../models/User");
const Astrologer = require("../models/Astrologer"); // needed for uniqueness check
const bcrypt = require("bcryptjs");

// Register new user with email uniqueness across both collections
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, dob, birthTime, birthPlace } = req.body;

    // Check email across User and Astrologer
    if (await User.findOne({ email }) || await Astrologer.findOne({ email })) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check mobile uniqueness
    if (await User.findOne({ mobile })) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
