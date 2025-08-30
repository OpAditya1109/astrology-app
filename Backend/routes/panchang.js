// routes/panchang.js
import express from "express";
import axios from "axios";
const router = express.Router();

// Panchang endpoints available in FreeAstrologyAPI
const endpoints = [
  "tithi-durations",
  "nakshatra-durations",
  "yoga-durations",
  "karana-durations",
  "sunrise-sunset", // available
  "rahu-kalam",
  "abhijit-muhurta"
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

    res.json({ success: true, data });
  } catch (err) {
    console.error("Panchang API Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch full Panchang" });
  }
});

export default router;
