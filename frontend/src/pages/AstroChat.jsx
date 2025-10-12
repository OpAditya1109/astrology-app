// routes/chatbotRoutes.js
const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const router = express.Router();

// Initialize OpenAI client
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

    // Build astrologer-style prompt
    const prompt = `
You are an experienced Vedic astrologer AI.
Analyze the user's astrology insights based ONLY on:
- Date of Birth: ${profile.dob?.split("T")[0]}
- Time of Birth: ${profile.birthTime}
- Place of Birth: ${profile.birthPlace}

Guidelines:
1. Use zodiac logic, moon/sun sign understanding — no external planetary data.
2. Give helpful, spiritual, and friendly insights.
3. Avoid medical, financial, or health predictions.
4. Keep tone positive, accurate, and clear.

User question: ${query}
`;

    // Call OpenAI model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + accurate
      messages: [
        { role: "system", content: "You are a wise and friendly astrologer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate an astrology insight.";

    console.log("OpenAI reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
