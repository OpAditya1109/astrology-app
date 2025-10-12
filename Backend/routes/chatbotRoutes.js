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
  try {
    const { query, profile } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "User profile missing" });
    }

    // Build astrologer-style prompt with planetary references
    const prompt = `
You are a concise, wise Vedic astrologer AI.
Analyze based ONLY on the user's birth details:

- DOB: ${profile.dob?.split("T")[0]}
- Time: ${profile.birthTime}
- Place: ${profile.birthPlace}

Respond in a positive and short manner (max 4-5 lines). 
Include references to the planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) if relevant.
Focus on guidance, strengths, and life insights.


User question: ${query}
`;

    // Call OpenAI model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a wise Vedic astrologer giving short, clear answers with planetary references." },
        { role: "user", content: prompt },
      ],
      max_tokens: 120,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
