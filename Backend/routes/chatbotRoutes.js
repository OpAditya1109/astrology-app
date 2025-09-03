// routes/chatbotRoutes.js
const express = require("express");
const User = require("../models/User");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { query, profile } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "User profile missing" });
    }

    // Birth details
    const birthDetails = `
    Name: ${profile.name}
    DOB: ${new Date(profile.dob).toDateString()}
    Birth Time: ${profile.birthTime}
    Birth Place: ${profile.birthPlace}
    `;

    // Use OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or "gpt-4o" for more advanced
        messages: [
          {
            role: "system",
            content: `You are an expert astrologer AI. Always use the following user birth details for analysis:\n${birthDetails}\nGive astrology-based, friendly, and clear responses.`,
          },
          { role: "user", content: query },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply:
        response.data.choices[0].message.content ||
        "Sorry, I couldn’t generate a reply.",
    });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate reply." });
  }
});

module.exports = router;
