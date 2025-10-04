// routes/chatbotRoutes.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// Hugging Face API key from .env
const HF_API_KEY = process.env.HF_API_KEY;

router.post("/chat", async (req, res) => {
  try {
    const { query, profile } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "User profile missing" });
    }

    // Build prompt including user birth details
    const prompt = `
You are an expert astrologer AI. 
User birth details:
- Name: ${profile.name}
- DOB: ${profile.dob?.split("T")[0]}
- Birth Time: ${profile.birthTime}
- Birth Place: ${profile.birthPlace}

Instructions:
1. Analyze their zodiac, planetary positions, and life events.
2. Provide astrology-based, friendly, and clear advice.
3. Do not ask for birth details again.

User question: ${query}
`;

    // Call Hugging Face Falcon 7B Instruct model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Falcon 7B returns generated_text inside response.data[0].generated_text
    const reply = response.data[0]?.generated_text || "Sorry, I couldn't generate a reply.";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
