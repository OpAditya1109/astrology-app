const mongoose = require("mongoose");

const astrologerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: String,
    mobile: String,
    experience: Number,
    city: String,
    country: String,
    systemsKnown: [String],
    languagesKnown: [String],
    categories: [String],
    photo: { type: String, default: "" },
    role: { type: String, enum: ["astrologer"], default: "astrologer" },
    isAI: { type: Boolean, default: false },

    // ✅ Verification field
    isVerified: { type: Boolean, default: false },

    // ✅ New field: description / bio
    description: { type: String, default: "" },

    // ✅ Rates for different modes
    rates: {
      chat: { type: Number, default: 0 },
      video: { type: Number, default: 0 },
      audio: { type: Number, default: 0 },
    },

    // ✅ Online availability
    online: {
      chat: { type: Boolean, default: false },
      video: { type: Boolean, default: false },
      audio: { type: Boolean, default: false },
    },
totalTalkSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);
