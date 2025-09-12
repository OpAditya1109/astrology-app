const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to generate kundali and get Cloudinary URL
async function generateKundali(user) {
  try {
    const params = new URLSearchParams({
      dob: user.dob,
      tob: user.birthTime,
      lat: user.city.lat,
      lon: user.city.lon,
      tz: 5.5,
      lang: "en",
      api_key: process.env.VEDIC_CHART_API_KEY,
      div: "D1",
      style: "north",
      color: "black",
    });

    const url = `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${params.toString()}`;
    const response = await fetch(url);
    const svgString = await response.text();

    // Remove XML headers/DOCTYPE (Sharp dislikes these)
    const cleanedSvg = svgString
      .replace(/<\?xml.*?\?>/, "")
      .replace(/<!DOCTYPE.*?>/, "")
      .trim();

    const svgBuffer = Buffer.from(cleanedSvg, "utf-8");

    // Convert SVG to PNG with white background
    const pngBuffer = await sharp(svgBuffer)
      .flatten({ background: "#ffffff" })
      .toFormat("png")
      .toBuffer();

    // Upload to Cloudinary and return URL
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "kundalis", public_id: `${user.name}_${Date.now()}` },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(pngBuffer);
    });
  } catch (err) {
    console.error("❌ Kundali generation error:", err);
    return null;
  }
}


const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      dob,
      birthTime,
      birthPlace,
      city,
      lat,
      lon,
    } = req.body;

    // Email/mobile uniqueness check
    if ((await User.findOne({ email })) || (await Astrologer.findOne({ email }))) {
      return res.status(400).json({ error: "Email already exists" });
    }
    if (await User.findOne({ mobile })) {
      return res.status(400).json({ error: "Mobile number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      dob,
      birthTime,
      birthPlace,
      city: { name: city, lat: lat, lon: lon },
      kundlis: [],
    });

    // Generate kundali URL
    const kundaliUrl = await generateKundali(user);
    if (kundaliUrl) {
      user.kundlis.push({ url: kundaliUrl, createdAt: new Date() });
    }

    await user.save();

    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser };
