const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Consultation = require("./models/Consultation");
const Astrologer = require("./models/Astrologer");
const { getAstrologyResponse } = require("./api/astrology");
const panchangRoutes = require("./routes/panchang");

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
app.use("/api/payment", require("./routes/payment"));

// --- Create HTTP server ---
const server = http.createServer(app);

// --- Initialize Socket.IO ---
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Attach io to app so routes can emit events
app.set("io", io);

// --- Handle socket connections ---
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // --- Join user room for video call ---
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.id} joined room: ${roomId}`);

    // Notify existing peers in room
    socket.to(roomId).emit("peer-joined", { socketId: socket.id });
  });

  // --- Join astrologer room ---
  socket.on("joinAstrologerRoom", (astrologerId) => {
    socket.join(astrologerId);
    console.log(`📌 Astrologer ${socket.id} joined room: ${astrologerId}`);
  });

  // --- Chat messages ---
  socket.on("sendMessage", async ({ roomId, sender, text }) => {
    try {
      const consultation = await Consultation.findById(roomId);
      if (!consultation) return console.log("❌ Consultation not found:", roomId);

      const newMessage = { sender, text, senderModel: "User", createdAt: new Date() };
      consultation.messages.push(newMessage);
      await consultation.save();
      io.to(roomId).emit("newMessage", newMessage);

      // AI reply
      const astrologer = await Astrologer.findById(consultation.astrologerId);
      if (astrologer && astrologer.isAI) {
        const aiReply = await getAstrologyResponse(text);
        const aiMessage = {
          sender: astrologer._id,
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

  // --- VIDEO CALL SIGNALING ---
  socket.on("call-user", ({ to, offer }) => {
    if (to) {
      io.to(to).emit("incoming-call", { from: socket.id, offer });
    }
  });

  socket.on("answer-call", ({ to, answer }) => {
    if (to) {
      io.to(to).emit("call-answered", { from: socket.id, answer });
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (to) {
      io.to(to).emit("ice-candidate", { from: socket.id, candidate });
    }
  });

  // --- Handle disconnect ---
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    // Optional: notify others in all rooms
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(room => {
      socket.to(room).emit("peer-left", { socketId: socket.id });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
