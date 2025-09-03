const Astrologer = require("../models/Astrologer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Register Astrologer
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

    // Check if email exists
    const existingAstrologer = await Astrologer.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingAstrologer || existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload photo if available
    let photoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "astrologers" },
        (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ error: "Photo upload failed" });
          }

          photoUrl = uploadResult.secure_url;

          // Save astrologer only after successful upload
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
            photo: photoUrl, // ✅ save Cloudinary URL
          });

          astrologer.save()
            .then(() =>
              res.json({
                message: "Astrologer registered successfully",
                astrologerId: astrologer._id,
                photo: astrologer.photo,
              })
            )
            .catch((err) => {
              console.error("Mongo Save Error:", err);
              res.status(500).json({ error: "Server error" });
            });
        }
      );

      // Pipe file buffer into Cloudinary
      req.file.stream.pipe(result);
    } else {
      // If no photo, still save astrologer
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
      });

      await astrologer.save();
      res.json({ message: "Astrologer registered successfully (no photo)", astrologerId: astrologer._id });
    }
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerAstrologer };
