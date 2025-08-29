import Astrologer from "../models/Astrologer.js";
import Consultation from "../models/Consultation.js";

export const createAIConsultation = async (userId) => {
  const aiAstrologer = await Astrologer.findOne({ isAI: true });
  if (!aiAstrologer) throw new Error("AI Astrologer not found");

  const consultation = new Consultation({
    userId,
    astrologerId: aiAstrologer._id,
    topic: "AI Astrologer Chat",
    mode: "chat",
    bookedAt: new Date(),
    messages: [],
  });

  await consultation.save();
  return consultation;
};
