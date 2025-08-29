const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Astrologer = require("./models/Astrologer");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createAIAstrologer = async () => {
  await connectDB();

  const existing = await Astrologer.findOne({ _id: "AI_ASTRO_001" });
  if (existing) {
    console.log("AI Astrologer already exists");
    mongoose.connection.close();
    return;
  }

  const aiAstrologer = new Astrologer({
    _id: "AI_ASTRO_001",
    name: "AI Astrologer",
    email: "ai@astrologer.com", // dummy email
    password: "ai_dummy_password", // dummy password
    experience: 100,
    languagesKnown: ["English"],
    categories: ["Love", "Career", "Finance", "Health"],
    systemsKnown: ["Vedic", "Western", "Tarot"],
    isAI: true,
  });

  await aiAstrologer.save();
  console.log("✅ AI Astrologer created");
  mongoose.connection.close();
};

createAIAstrologer();

