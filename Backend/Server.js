const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");

const Consultation = require("./models/Consultation");
const Astrologer = require("./models/Astrologer");
const { getAstrologyResponse } = require("./api/astrology");
const panchangRoutes = require("./routes/panchang");
const chatbotRoutes = require("./routes/chatbotRoutes");
const orderRoute =require("./routes/orderRoutes")
const enquiryRoutes = require("./routes/enquiryRoutes")
const { Server } = require("socket.io"); // make sure your io is initialized
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


const activeTimers = {}; // { roomId: { interval, secondsLeft } }
const waitingMessages = {};

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // --- Join user room ---
  socket.on("joinRoom", async (roomId) => {
    try {
      socket.join(roomId);
      const consultation = await Consultation.findById(roomId);
      if (!consultation) return;

      // Restore running timer from DB
      if (consultation.timer?.isRunning) {
        const remaining =
          consultation.timer.durationMinutes * 60 -
          Math.floor((Date.now() - new Date(consultation.timer.startTime)) / 1000);

        startTimer(roomId, remaining);
      }
    } catch (err) {
      console.error("joinRoom error:", err);
    }
  });

  // --- Send message ---
  socket.on("sendMessage", async ({ roomId, sender, text, kundaliUrl, system }) => {
    try {
      const consultation = await Consultation.findById(roomId);
      if (!consultation) return;

      const newMessage = {
        sender,
        text,
        kundaliUrl,
        system: system || false,
        senderModel: "User",
        createdAt: new Date(),
      };
      consultation.messages.push(newMessage);
      await consultation.save();

      io.to(roomId).emit("newMessage", newMessage);

      // Start timer if astrologer sends first message
      const astrologer = await Astrologer.findById(consultation.astrologerId);
      if (astrologer && sender === astrologer._id.toString() && !consultation.timer?.isRunning) {
        consultation.timer = { startTime: new Date(), durationMinutes: 5, isRunning: true };
        await consultation.save();
        startTimer(roomId, consultation.timer.durationMinutes * 60);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // --- Extend consultation timer ---
  socket.on("extendConsultationTimer", ({ roomId, extendMinutes }) => {
    if (!activeTimers[roomId]) return; // Timer must be running
    const addSeconds = extendMinutes * 60;
    activeTimers[roomId].secondsLeft += addSeconds;
    io.to(roomId).emit("timerUpdate", { secondsLeft: activeTimers[roomId].secondsLeft });
  });

  // --- Timer manual start ---
  socket.on("startConsultationTimer", ({ roomId, durationMinutes = 5 }) => {
    if (!roomId || activeTimers[roomId]) return;
    startTimer(roomId, durationMinutes * 60);
  });

  // --- Timer manual stop ---
  socket.on("stopConsultationTimer", ({ roomId }) => {
    stopTimer(roomId, true); // true = manual stop
  });

  // --- Join astrologer room ---
  socket.on("joinAstrologerRoom", async (astrologerId) => {
    socket.join(astrologerId);
    console.log(`📌 Astrologer ${socket.id} joined room: ${astrologerId}`);
  });

  // --- Video call signaling ---
  socket.on("call-user", ({ to, offer }) => {
    if (to) io.to(to).emit("incoming-call", { from: socket.id, offer });
  });
  socket.on("answer-call", ({ to, answer }) => {
    if (to) io.to(to).emit("call-answered", { from: socket.id, answer });
  });
  socket.on("ice-candidate", ({ to, candidate }) => {
    if (to) io.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    rooms.forEach((room) => {
      socket.to(room).emit("peer-left", { socketId: socket.id });
    });
  });

  // --- Helper functions ---
  function startTimer(roomId, seconds) {
    if (activeTimers[roomId]) return; // already running

    activeTimers[roomId] = {
      secondsLeft: seconds,
      interval: setInterval(async () => {
        try {
          if (!activeTimers[roomId]) return;

          activeTimers[roomId].secondsLeft--;
          io.to(roomId).emit("timerUpdate", { secondsLeft: activeTimers[roomId].secondsLeft });

          if (activeTimers[roomId].secondsLeft <= 0) {
            await finalizeConsultation(roomId, true); // auto end
            io.to(roomId).emit("timerEnded");
          }
        } catch (err) {
          console.error("Timer interval error:", err);
        }
      }, 1000),
    };
  }

  async function stopTimer(roomId, manual = false) {
    if (!activeTimers[roomId]) return;

    clearInterval(activeTimers[roomId].interval);
    await finalizeConsultation(roomId, manual);
    delete activeTimers[roomId];
  }

  // Save talk seconds into Consultation + Astrologer
  async function finalizeConsultation(roomId, endedByTimer = false) {
    try {
      const c = await Consultation.findById(roomId);
      if (!c?.timer) return;

      const totalAllocatedSeconds = c.timer.durationMinutes * 60;
      let talkedSeconds;

      if (endedByTimer) {
        // Timer fully used
        talkedSeconds = totalAllocatedSeconds;
      } else {
        // Manual stop → calculate from remaining
        const remaining = activeTimers[roomId]?.secondsLeft || 0;
        talkedSeconds = totalAllocatedSeconds - remaining;
      }

      // Save to consultation
      c.timer.isRunning = false;
      c.talkSeconds = talkedSeconds;
      await c.save();

      // Update astrologer total talk
      const astro = await Astrologer.findById(c.astrologerId);
      if (astro) {
        astro.totalTalkSeconds = (astro.totalTalkSeconds || 0) + talkedSeconds;
        await astro.save();
      }
    } catch (err) {
      console.error("finalizeConsultation error:", err);
    }
  }
});



// --- Server listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
