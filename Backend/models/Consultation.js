const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  astrologerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Astrologer",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Completed"],
    default: "Pending",
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  scheduledFor: {
    type: Date,
  },
  duration: {
    type: Number,
    default: 30,
  },
  mode: {
    type: String,
    enum: ["Chat", "Audio", "Video"],
    default: "Chat",
  },

  // 💬 Chat messages for this consultation
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderModel' },
      senderModel: { type: String, enum: ['User', 'Astrologer'] }, // track sender type
      text: String,
      createdAt: { type: Date, default: Date.now },
    }
  ]
});

// ✅ Prevent duplicate consultation rooms between same user & astrologer
consultationSchema.index({ userId: 1, astrologerId: 1 }, { unique: true });

module.exports = mongoose.model("Consultation", consultationSchema);
