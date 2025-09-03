const Astrologer = require("../models/Astrologer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

// 🔹 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register Astrologer with photo upload
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

    // Check uniqueness across both collections
    const existingAstrologer = await Astrologer.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingAstrologer || existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Upload photo to Cloudinary if provided
    let photoUrl = "";
    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload_stream(
        { folder: "astrologers" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Photo upload failed");
          }
          return result;
        }
      );

      // Wait for stream
      const stream = cloudinary.uploader.upload_stream(
        { folder: "astrologers" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Photo upload failed" });
          }
          photoUrl = result.secure_url;
        }
      );
      stream.end(req.file.buffer);
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
      photo: photoUrl, // ✅ save Cloudinary photo URL
    });

    await astrologer.save();

    res.json({
      message: "Astrologer registered successfully",
      astrologerId: astrologer._id,
      photo: astrologer.photo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerAstrologer };
