const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/panchang", async (req, res) => {
  try {
    const { date, lat, lon, tz, lang, time } = req.body;

    const apiKey = process.env.VEDIC_ASTRO_API_KEY; // ✅ use env variable
    const url = `https://api.vedicastroapi.com/v3-json/panchang/panchang?api_key=${apiKey}&date=${encodeURIComponent(date)}&lat=${lat}&lon=${lon}&tz=${tz}&time=${time}&lang=${lang}`;

    const { data } = await axios.get(url);

    if (data?.status === 200 && data.response) {
      const r = data.response;
      const extracted = {
        day: r.day?.name,
        date: r.date,

        tithi: {
          name: r.tithi?.name,
          type: r.tithi?.type,
          start: r.tithi?.start,
          end: r.tithi?.end,
          meaning: r.tithi?.meaning,
          special: r.tithi?.special,
          diety: r.tithi?.diety,
        },

        nakshatra: {
          name: r.nakshatra?.name,
          lord: r.nakshatra?.lord,
          diety: r.nakshatra?.diety,
          start: r.nakshatra?.start,
          end: r.nakshatra?.end,
          meaning: r.nakshatra?.meaning,
          special: r.nakshatra?.special,
        },

        karana: {
          name: r.karana?.name,
          type: r.karana?.type,
          start: r.karana?.start,
          end: r.karana?.end,
          special: r.karana?.special,
        },

        yoga: {
          name: r.yoga?.name,
          start: r.yoga?.start,
          end: r.yoga?.end,
          meaning: r.yoga?.meaning,
          special: r.yoga?.special,
        },

        masa: `${r.advanced_details?.masa?.amanta_name} / ${r.advanced_details?.masa?.purnimanta_name}`,
        paksha: r.advanced_details?.masa?.paksha,
        sunrise: r.advanced_details?.sun_rise,
        sunset: r.advanced_details?.sun_set,
        moonrise: r.advanced_details?.moon_rise,
        moonset: r.advanced_details?.moon_set,
      };

      return res.json(extracted);
    } else {
      return res.status(400).json({ error: "Invalid API response", raw: data });
    }
  } catch (err) {
    console.error("❌ Panchang API error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch Panchang", details: err.message });
  }
});

module.exports = router;
