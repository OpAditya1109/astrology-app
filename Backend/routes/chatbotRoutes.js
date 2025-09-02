// routes/chatbotRoutes.js
const express = require("express");
const User = require("../models/User");
const axios = require("axios");

const router = express.Router();

// Chatbot endpoint
router.post("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body; // user's message from frontend

    // Fetch user details
    const user = await User.findById(userId).select("name dob birthTime birthPlace");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Format user details
    const birthDetails = `
    Name: ${user.name}
    DOB: ${user.dob.toDateString()}
    Birth Time: ${user.birthTime}
    Birth Place: ${user.birthPlace}
    `;

    // First system message for HuggingFace / AI
    const systemMessage = `You are an astrologer AI. Use these birth details to give personalized astrology:
${birthDetails}
Now continue the conversation naturally.`;

    // Send to Hugging Face API (example using Mistral/any LLM)
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: `${systemMessage}\nUser: ${message}\nAstrologer:`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    res.json({
      reply: response.data[0]?.generated_text || "Sorry, I couldn’t generate a reply.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
