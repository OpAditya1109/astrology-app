const mongoose = require("mongoose");

const astrologerSchema = new mongoose.Schema(
  {
  
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: String,
    mobile: String,
    experience: Number, // in years
    city: String,
    country: String,
    systemsKnown: [String], // e.g., ["Vedic", "KP", "Numerology"]
    languagesKnown: [String], // e.g., ["English", "Hindi"]
    categories: [String], // e.g., ["Love", "Career", "Health"]

    // New role field with default
    role: {
      type: String,
      enum: ["astrologer"],
      default: "astrologer",
    },

    // AI flag
    isAI: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);
