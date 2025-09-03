const Astrologer = require("../models/Astrologer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: wrap Cloudinary upload in a promise
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "astrologers" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

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

    // Check email
    const existingAstrologer = await Astrologer.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingAstrologer || existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload photo if provided
    let photoUrl = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      photoUrl = uploadResult.secure_url;
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
      systemsKnown: Array.isArray(systemsKnown) ? systemsKnown : [systemsKnown],
      languagesKnown: Array.isArray(languagesKnown) ? languagesKnown : [languagesKnown],
      categories: Array.isArray(categories) ? categories : [categories],
      photo: photoUrl,
    });

    await astrologer.save();

    res.json({
      message: "Astrologer registered successfully",
      astrologerId: astrologer._id,
      photo: astrologer.photo,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerAstrologer };
