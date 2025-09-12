const User = require("../models/User");
const Astrologer = require("../models/Astrologer");
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function formatDateForAPI(dob) {
  const date = new Date(dob);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper to generate kundali PNG (Cloudinary upload commented out)
const generateKundali = async (user) => {
  try {
    // Format DOB for API (DD/MM/YYYY)
    const date = new Date(user.dob);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dobFormatted = `${day}/${month}/${year}`;

    // Build API URL
    const params = new URLSearchParams({
      dob: dobFormatted,
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

    // Convert SVG → PNG buffer with Sharp
    const pngBuffer = await sharp(Buffer.from(svgString))
      .flatten({ background: "#ffffff" }) // white background
      .png()
      .toBuffer();

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "kundalis",
          public_id: `${user.name}_${Date.now()}`,
          resource_type: "image",
        },
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
};

// User registration with kundali PNG (Cloudinary upload commented out)
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, dob, birthTime, birthPlace, city, lat, lon } = req.body;

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
      city: { name: city, lat, lon },
      kundlis: [],
    });

  
   // Generate kundali PNG and upload
const kundaliUrl = await generateKundali(user);
if (kundaliUrl) {
  user.kundlis.push({ url: kundaliUrl, createdAt: new Date() }); // <-- store URL
}


    await user.save();
    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser };
