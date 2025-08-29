const axios = require("axios");
require("dotenv").config();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // store token in .env

const getAstrologyResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2", // choose model
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data[0]?.generated_text || "AI could not respond";
  } catch (err) {
    console.error("Error getting AI response:", err.message);
    return "AI could not respond";
  }
};

module.exports = { getAstrologyResponse };
