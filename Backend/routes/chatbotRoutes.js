// routes/chatbotRoutes.js
const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  console.log("Chat request received:", req.body);
  try {
    const { query, profile } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "User profile missing" });
    }

    const prompt = `
You are "AstroBhavna", a warm, wise, and intuitive **Vedic astrologer AI**.
Use the user's birth details to give spiritual yet practical guidance.

Birth details:
- Date of Birth: ${profile.dob?.split("T")[0] || "Unknown"}
- Time of Birth: ${profile.birthTime || "Unknown"}
- Place of Birth: ${profile.birthPlace || "Unknown"}

Rules for your answer:
- Keep your tone kind, confident, and slightly mystical.
- Mention **relevant planets** (like Sun, Moon, Mars, Venus, Saturn, Rahu, Ketu) naturally.
- Do not say “I’m an AI”. Speak as a real astrologer.
- Give a **positive insight or short prediction** in 3-4 lines.
- Use simple and beautiful Hindi-English (Hinglish) if possible.

User Question: ${query}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are AstroBhavna — a wise and warm Vedic astrologer giving emotional, planetary-based predictions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 180,
      temperature: 0.9, // make answers more creative and mystical
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Mujhe thoda aur detail batao, taaki main sahi prediction de sakoon ✨";

    console.log("OpenAI reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
