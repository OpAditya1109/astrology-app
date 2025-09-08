// cron/panchangCron.js
const cron = require("node-cron");
const axios = require("axios");
const Panchang = require("../models/Panchang");

cron.schedule(
  "1 0 * * *", // Every day at 00:01
  async () => {
    try {
      console.log("⏰ Cron triggered at:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const dateKey = `${yyyy}-${mm}-${dd}`;

      // Avoid duplicate fetch
      const exists = await Panchang.findOne({ date: dateKey });
      if (exists) {
        console.log("⚡ Panchang already cached for", dateKey);
        return;
      }

      const lat = "18.9582"; // Mumbai default
      const lon = "72.8321";
      const tz = 5.5;
      const time = "00:01";
      const lang = "en";
      const apiKey = process.env.VEDIC_ASTRO_API_KEY;

      const url = `https://api.vedicastroapi.com/v3-json/panchang/panchang?api_key=${apiKey}&date=${dd}/${mm}/${yyyy}&lat=${lat}&lon=${lon}&tz=${tz}&time=${time}&lang=${lang}`;

      console.log("🌐 Fetching Panchang from API for", dateKey);

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

        await Panchang.create({
          date: dateKey,
          lat,
          lon,
          tz,
          lang,
          data: extracted,
        });

        console.log("✅ Panchang cached successfully for", dateKey);
      } else {
        console.error("❌ Invalid Panchang API response:", data);
      }
    } catch (err) {
      console.error("❌ Cron Panchang fetch failed:", err.response?.data || err.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Ensure it runs in IST
  }
);
