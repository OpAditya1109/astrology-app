// routes/panchang.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const endpoints = [
  "tithi-timings",
  "nakshatra-durations",
  "yoga-timings",
  "karana-timings",
  "sunrise-sunset",
];

router.post("/panchang", async (req, res) => {
  const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = req.body;

  try {
    const promises = endpoints.map((ep) =>
      axios.post(
        `https://json.freeastrologyapi.com/${ep}`,
        { year, month, date, hours, minutes, seconds, latitude, longitude, timezone },
        { headers: { "Content-Type": "application/json", "x-api-key": process.env.ASTRO_API_KEY } }
      )
    );

    const results = await Promise.all(promises);
    const data = {};
    endpoints.forEach((ep, idx) => {
      data[ep] = results[idx].data;
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch full Panchang" });
  }
});

module.exports = router; // ✅ use module.exports
