// routes/panchang.js
const express = require("express");
const axios = require("axios");
const Panchang = require("../models/Panchang");
const router = express.Router();

router.get("/panchang", async (req, res) => {
  try {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const dateKey = `${yyyy}-${mm}-${dd}`;

    // Check if Panchang is already in DB
    let cached = await Panchang.findOne({ date: dateKey });
    if (cached) {
      return res.json(cached.data);
    }

    // If not cached, fetch from API
    const lat = "18.9582"; // Default Mumbai
    const lon = "72.8321";
    const tz = 5.5;
    const time = `${now.getHours()}:${now.getMinutes()}`;
    const lang = "hi";
    const apiKey = process.env.VEDIC_ASTRO_API_KEY;
    const url = `https://api.vedicastroapi.com/v3-json/panchang/panchang?api_key=${apiKey}&date=${dd}/${mm}/${yyyy}&lat=${lat}&lon=${lon}&tz=${tz}&time=${time}&lang=${lang}`;

    const { data } = await axios.get(url);
    if (data?.status === 200 && data.response) {
      const r = data.response;
      const extracted = {
        day: r.day?.name,
        date: r.date,
        tithi: r.tithi,
        nakshatra: r.nakshatra,
        karana: r.karana,
        yoga: r.yoga,
        masa: `${r.advanced_details?.masa?.amanta_name} / ${r.advanced_details?.masa?.purnimanta_name}`,
        paksha: r.advanced_details?.masa?.paksha,
        sunrise: r.advanced_details?.sun_rise,
        sunset: r.advanced_details?.sun_set,
        moonrise: r.advanced_details?.moon_rise,
        moonset: r.advanced_details?.moon_set,
      };

      // Save to DB
      await Panchang.create({ date: dateKey, lat, lon, tz, lang, data: extracted });
console.log("Serving Panchang:", cached?.data);

      return res.json(extracted);
    } else {
      return res.status(400).json({ error: "Invalid API response" });
    }
  } catch (err) {
    console.error("❌ Panchang API error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch Panchang", details: err.message });
  }
});

module.exports = router;
