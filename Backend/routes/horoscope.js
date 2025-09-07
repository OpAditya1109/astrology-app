// backend/routes/horoscope.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const signs = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

router.get("/all", async (req, res) => {
  try {
    const horoscopes = {};

    // Fetch horoscope for each sign
    for (const sign of signs) {
      const response = await axios.get(
        "https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily",
        { params: { sign, day: "TODAY" } }
      );
      horoscopes[sign] = response.data;
    }

    res.json(horoscopes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch horoscopes" });
  }
});

module.exports = router;
