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

    // Build astrologer-style prompt (short and efficient)
    const prompt = `
You are a concise, wise Vedic astrologer AI.
Analyze based ONLY on:
- DOB: ${profile.dob?.split("T")[0]}
- Time: ${profile.birthTime}
- Place: ${profile.birthPlace}

Respond in a positive and short manner (max 2-3 lines). 
Include references to the planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) if relevant.
Focus on guidance, strengths, and life insights.


User question: ${query}
`;

    // Call OpenAI model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // efficient + cheap
      messages: [
        { role: "system", content: "You are a wise Vedic astrologer giving short, clear answers with planetary references." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100, // limit response length
      temperature: 0.7, // balanced creativity
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    console.log("OpenAI reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.message || err);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
