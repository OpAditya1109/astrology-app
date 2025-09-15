const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: String,
  country: String,
  courseId: { type: String, required: true }, // so you know which course enquiry
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);