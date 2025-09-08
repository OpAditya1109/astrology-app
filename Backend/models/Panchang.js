// models/Panchang.js
const mongoose = require("mongoose");

const PanchangSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  lat: Number,
  lon: Number,
  tz: Number,
  lang: String,
  data: Object, // Store the extracted Panchang response
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Panchang", PanchangSchema);
