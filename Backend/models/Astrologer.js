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

    // ✅ Tracking stats
    stats: {
      // counts
      totalChats: { type: Number, default: 0 },
      totalVideos: { type: Number, default: 0 },
      totalAudios: { type: Number, default: 0 },

      // minutes
      chatMinutes: { type: Number, default: 0 },
      videoMinutes: { type: Number, default: 0 },
      audioMinutes: { type: Number, default: 0 },

      // customers
      totalCustomers: { type: Number, default: 0 },
      uniqueCustomers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Astrologer", astrologerSchema);
