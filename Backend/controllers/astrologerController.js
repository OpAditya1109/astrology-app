const Astrologer = require("../models/Astrologer");
const User = require("../models/User"); // For uniqueness check
const bcrypt = require("bcryptjs");
const { v2: cloudinary } = require("cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Upload photo to Cloudinary (if provided)
    let photoUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "astrologers" },
          (error, uploaded) => {
            if (error) reject(error);
            else resolve(uploaded);
          }
        );
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }

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
      photo: photoUrl, // ✅ save photo
    });

    await astrologer.save();

    res.json({
      message: "Astrologer registered successfully",
      astrologerId: astrologer._id,
      photo: photoUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerAstrologer };
