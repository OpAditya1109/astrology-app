// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Consultation = require("./models/Consultation");
const Astrologer = require("./models/Astrologer");
const { getAstrologyResponse } = require("./api/astrology");
const panchangRoutes = require("./routes/panchang"); // ✅ use require


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// --- REST API routes ---
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/astrologers", require("./routes/astrologerRoutes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/Consult-astrologers", require("./routes/astrologers"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/ai-astrologer", require("./routes/aiRoutes"));
app.use("/api", panchangRoutes);
// --- Create HTTP server ---
const server = http.createServer(app);

// --- Initialize Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Attach io to app so routes can emit events
app.set("io", io);

// --- Handle socket connections ---
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // Join a chat room (user <-> astrologer)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.id} joined room: ${roomId}`);
  });

  // Join astrologer room for notifications
  socket.on("joinAstrologerRoom", (astrologerId) => {
    socket.join(astrologerId);
    console.log(`📌 Astrologer ${socket.id} joined room: ${astrologerId}`);
  });

  // Handle sending messages (user + AI)
  socket.on("sendMessage", async ({ roomId, sender, text }) => {
    try {
      const consultation = await Consultation.findById(roomId);
      if (!consultation) {
        console.log("❌ Consultation not found:", roomId);
        return;
      }

      // Save user/human message
      const newMessage = {
        sender,
        text,
        senderModel: "User",
        createdAt: new Date(),
      };
      consultation.messages.push(newMessage);
      await consultation.save();

      // Emit user message
      io.to(roomId).emit("newMessage", newMessage);

      // --- AI reply ---
      const astrologer = await Astrologer.findById(consultation.astrologerId);
      if (astrologer && astrologer.isAI) {
        const aiReply = await getAstrologyResponse(text);

        const aiMessage = {
          sender: astrologer._id, // ObjectId
          senderModel: "Astrologer",
          text: aiReply,
          createdAt: new Date(),
        };

        consultation.messages.push(aiMessage);
        await consultation.save();

        io.to(roomId).emit("newMessage", aiMessage);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error.message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
