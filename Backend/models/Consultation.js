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
    enum: ["pending", "completed", "cancelled", "ongoing"],
    default: "pending",
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

  // ✅ Kundali URL at consultation level
  kundaliUrl: {
    type: String,
    default: null,
  },

  // 💬 Chat messages for this consultation
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'messages.senderModel' },
      senderModel: { type: String, enum: ['User', 'Astrologer'] },
      text: String,
      kundaliUrl: { type: String, default: null },
      system: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    }
  ],

  // ✅ Rate per minute for this consultation
  rate: {
    type: Number,
    default: 0,
  },

  // ✅ Persistent timer to handle refresh
  timer: {
    startTime: { type: Date, default: null },      // when timer started
    durationMinutes: { type: Number, default: 5 }, // total duration in minutes
    isRunning: { type: Boolean, default: false },
  },
talkSeconds: { type: Number, default: 0 }, // total actual talked time in seconds


});

// ✅ Prevent duplicate consultation rooms between same user & astrologer
consultationSchema.index({ userId: 1, astrologerId: 1 }, { unique: true });

module.exports = mongoose.model("Consultation", consultationSchema);
