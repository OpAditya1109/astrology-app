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
const chatbotRoutes = require("./routes/chatbotRoutes");
const orderRoute =require("./routes/orderRoutes")
const enquiryRoutes = require("./routes/enquiryRoutes")

const horoscopeRoutes = require("./routes/horoscope");
const freeKundaliRoute = require("./routes/freeKundali");

require("./cron/panchangCorn");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/wallet/webhook", express.text({ type: "*/*" }));
app.use("/api/wallet/webhook", express.urlencoded({ extended: true }));
app.use("/api/wallet/webhook", express.json());
app.use(cors());
app.use("/api/free-kundali", freeKundaliRoute);
// --- REST API routes ---
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/astrologers", require("./routes/astrologerRoutes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/Consult-astrologers", require("./routes/astrologers"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/ai-astrologer", require("./routes/aiRoutes"));
app.use("/api", panchangRoutes);
app.use("/api/wallet", require("./routes/payment"));
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admin", require("./routes/admin"));

async function sendSystemMessage(roomId, text, kundaliUrl = null) {
  const consultation = await Consultation.findById(roomId);
  if (!consultation) return;

  const systemMessage = {
    sender: "system",
    text,
    kundaliUrl,
    system: true,
    createdAt: new Date(),
  };

  consultation.messages.push(systemMessage);
  await consultation.save();

  io.to(roomId).emit("newMessage", systemMessage);
}

app.use("/api/horoscope", horoscopeRoutes);
// --- Create HTTP server ---
const server = http.createServer(app);

// --- Initialize Socket.IO ---
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Attach io to app so routes can emit events
app.set("io", io);

// --- Active timers storage ---
const activeTimers = {};

// --- Handle socket connections ---
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // --- Join user room for chat/video ---
  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`📌 User ${socket.id} joined room: ${roomId}`);

    // --- Send list of existing peers ---
    try {
      const sockets = await io.in(roomId).fetchSockets();
      const peers = sockets.filter((s) => s.id !== socket.id).map((s) => s.id);
      if (peers.length) socket.emit("existing-peers", { peers });
    } catch (e) {
      console.error("fetchSockets failed:", e);
    }

    socket.to(roomId).emit("peer-joined", { socketId: socket.id });

    // --- Send system message "Waiting for astrologer..." ---
    let waitingMessageId = null;
    try {
      const consultation = await Consultation.findById(roomId);
      if (consultation) {
        const waitingMessage = {
          sender: "system",
          text: "⏳ Waiting for astrologer to start the consultation...",
          system: true,
          createdAt: new Date(),
        };
        consultation.messages.push(waitingMessage);
        await consultation.save();

        io.to(roomId).emit("newMessage", waitingMessage);
        waitingMessageId = waitingMessage._id; // track to remove later

        // Send Kundali system message if exists
        if (consultation.kundaliUrl) {
          const kundaliMessage = {
            sender: "system",
            text: "📜 Kundali is ready for this consultation",
            kundaliUrl: consultation.kundaliUrl,
            system: true,
            createdAt: new Date(),
          };
          consultation.messages.push(kundaliMessage);
          await consultation.save();
          io.to(roomId).emit("newMessage", kundaliMessage);
        }
      }
    } catch (err) {
      console.error("❌ Failed to send system messages:", err.message);
    }

    // --- Chat messages ---
    socket.on("sendMessage", async ({ roomId, sender, text, kundaliUrl, system }) => {
      try {
        const consultation = await Consultation.findById(roomId);
        if (!consultation) return console.log("❌ Consultation not found:", roomId);

        const newMessage = {
          sender,
          text,
          kundaliUrl: kundaliUrl || null,
          system: system || false,
          senderModel: "User",
          createdAt: new Date(),
        };

        consultation.messages.push(newMessage);
        await consultation.save();
        io.to(roomId).emit("newMessage", newMessage);

        const astrologer = await Astrologer.findById(consultation.astrologerId);

        // ✅ Start 5-min timer only when astrologer sends first message
        if (
          astrologer &&
          sender === astrologer._id.toString() &&
          !activeTimers[roomId]
        ) {
          // Remove waiting message if exists
          if (waitingMessageId) {
            consultation.messages = consultation.messages.filter(
              (m) => m._id.toString() !== waitingMessageId.toString()
            );
            await consultation.save();
            io.to(roomId).emit("removeMessage", waitingMessageId);
          }

          let secondsLeft = 5 * 60; // 5 minutes
          console.log(`⏱️ Timer started for room ${roomId} (astrologer sent first message)`);

          io.to(roomId).emit("timerUpdate", { secondsLeft });

          activeTimers[roomId] = setInterval(() => {
            secondsLeft--;
            io.to(roomId).emit("timerUpdate", { secondsLeft });

            if (secondsLeft <= 0) {
              clearInterval(activeTimers[roomId]);
              delete activeTimers[roomId];
              io.to(roomId).emit("timerEnded");
              console.log(`⏰ Timer ended for room ${roomId}`);
            }
          }, 1000);
        }

        // ✅ AI reply logic
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
  });

  // --- Join astrologer room ---
  socket.on("joinAstrologerRoom", (astrologerId) => {
    socket.join(astrologerId);
    console.log(`📌 Astrologer ${socket.id} joined room: ${astrologerId}`);
  });

  // --- VIDEO CALL SIGNALING ---
  socket.on("call-user", ({ to, offer }) => {
    if (to) io.to(to).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("answer-call", ({ to, answer }) => {
    if (to) io.to(to).emit("call-answered", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (to) io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  // --- Timer logic ---
  socket.on("startConsultationTimer", ({ roomId, durationMinutes = 5 }) => {
    if (!roomId || activeTimers[roomId]) return;

    let secondsLeft = durationMinutes * 60;
    io.to(roomId).emit("timerUpdate", { secondsLeft });

    activeTimers[roomId] = setInterval(() => {
      secondsLeft--;
      io.to(roomId).emit("timerUpdate", { secondsLeft });

      if (secondsLeft <= 0) {
        clearInterval(activeTimers[roomId]);
        delete activeTimers[roomId];
        io.to(roomId).emit("timerEnded");
      }
    }, 1000);
  });

  socket.on("stopConsultationTimer", ({ roomId }) => {
    if (activeTimers[roomId]) {
      clearInterval(activeTimers[roomId]);
      delete activeTimers[roomId];
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      socket.to(room).emit("peer-left", { socketId: socket.id });
    });
  });
});


// --- Server listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
