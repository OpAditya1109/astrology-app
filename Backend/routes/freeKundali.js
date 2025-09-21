const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Free Kundali Route
router.post("/", async (req, res) => {
  try {
    const { dob, tob, lat, lon, lang = "en" } = req.body;

    if (!dob || !tob || !lat || !lon) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Format DOB (DD/MM/YYYY)
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const dobFormatted = `${day}/${month}/${year}`;

    // Build API request
    const params = new URLSearchParams({
      dob: dobFormatted,
      tob,
      lat,
      lon,
      tz: 5.5,
      lang,
      api_key: process.env.FREE_KUNDALI_CHART_API_KEY,
      div: "D1",
      style: "north",
      color: "black",
    });

    const url = `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${params.toString()}`;
    const response = await fetch(url);

    let svgString = await response.text();

    // 🔥 Increase all font-sizes (both inline styles & attributes)
    svgString = svgString
      .replace(/font-size:\s*[\d.]+px/g, "font-size:18px") // inline CSS
      .replace(/font-size="[\d.]+px"/g, 'font-size="18px"'); // attribute

    res.json({ svg: svgString });
  } catch (err) {
    console.error("❌ Free Kundali error:", err);
    res.status(500).json({ error: "Failed to generate kundali" });
  }
});

module.exports = router;
