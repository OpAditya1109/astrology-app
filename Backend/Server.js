const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");

const Consultation = require("./models/Consultation");
const Admin = require("./models/Admin")
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


const activeTimers = {}; // { roomId: { interval, secondsLeft, totalAllocated, startTime } }
const waitingMessages = {};

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  // --- Join user room ---
  socket.on("joinRoom", async (roomId) => {
  try {
    socket.join(roomId);
    const consultation = await Consultation.findById(roomId);
    if (!consultation) return;

    // --- Restore running timer from DB ---
    if (consultation.timer?.isRunning) {
      const remaining =
        consultation.timer.durationMinutes * 60 -
        Math.floor((Date.now() - new Date(consultation.timer.startTime)) / 1000);

      startTimer(roomId, remaining);
    }

    // --- Get other peers already in this room ---
    const peers = [...(io.sockets.adapter.rooms.get(roomId) || [])]
      .filter((id) => id !== socket.id);

    // Tell this socket who’s already here
    socket.emit("existing-peers", { peers });

    // Notify existing peers about the new joiner
    peers.forEach((peerId) => {
      io.to(peerId).emit("peer-joined", { socketId: socket.id });
    });

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
      if (
        astrologer &&
        sender === astrologer._id.toString() &&
        !consultation.timer?.isRunning
      ) {
        consultation.timer = {
          startTime: new Date(),
          durationMinutes: 5,
          isRunning: true,
        };
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
    activeTimers[roomId].totalAllocated += addSeconds; // ✅ track full purchased
    io.to(roomId).emit("timerUpdate", {
      secondsLeft: activeTimers[roomId].secondsLeft,
    });
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



// ================= VIDEO CALL SOCKET LOGIC =================
// --- Join Video Room ---
socket.on("joinVideoRoom", async ({ roomId, role }) => {
  const videoRoomId = `${roomId}-video`;
  socket.join(videoRoomId);
  console.log(`🎥 ${role} (${socket.id}) joined ${videoRoomId}`);

  try {
    const consultation = await Consultation.findById(roomId);

    if (consultation?.timer?.isRunning) {
      const totalSeconds = consultation.timer.durationMinutes * 60;
      const elapsed = Math.floor((Date.now() - new Date(consultation.timer.startTime)) / 1000);
      const remaining = totalSeconds - elapsed;

      // Send timer to newly joined peer
      socket.emit("video-timer-started", { remaining: Math.max(remaining, 0) });
    }
  } catch (err) {
    console.error("joinVideoRoom -> DB error:", err);
  }

  // Send existing peers
  const peers = [...(io.sockets.adapter.rooms.get(videoRoomId) || [])].filter(id => id !== socket.id);
  socket.emit("video-existing-peers", { peers });
  peers.forEach(peerId => io.to(peerId).emit("video-peer-joined", { socketId: socket.id }));
});

// --- Request Current Video Timer ---
socket.on("request-video-timer", async ({ roomId }) => {
  try {
    const consultation = await Consultation.findById(roomId);

    if (consultation?.timer?.isRunning) {
      const totalSeconds = consultation.timer.durationMinutes * 60;
      const elapsed = Math.floor((Date.now() - new Date(consultation.timer.startTime)) / 1000);
      const remaining = totalSeconds - elapsed;
      socket.emit("video-timer-started", { remaining: Math.max(remaining, 0) });
    }
  } catch (err) {
    console.error(err);
  }
});

// --- User calls astrologer ---
socket.on("video-call-user", ({ roomId, to, offer }) => {
  if (to) {
    io.to(to).emit("video-incoming-call", { from: socket.id, offer });
    console.log(`📞 Incoming call from ${socket.id} to ${to}`);
  }
});

// --- Astrologer answers call & starts timer ---
socket.on("video-answer-call", async ({ roomId, to, answer }) => {
  if (to) io.to(to).emit("video-call-answered", { from: socket.id, answer });

  try {
    const consultation = await Consultation.findById(roomId);

    if (!consultation) return;

    // Initialize timer if not running
    if (!consultation.timer?.isRunning) {
      consultation.timer = consultation.timer || {};
      consultation.timer.startTime = new Date();
      consultation.timer.durationMinutes = consultation.timer.durationMinutes || 5;
      consultation.timer.isRunning = true;
      await consultation.save();

      const videoRoomId = `${roomId}-video`;
      const totalSeconds = consultation.timer.durationMinutes * 60;

      // Create active timer
      if (!activeTimers[roomId]) {
        activeTimers[roomId] = {
          secondsLeft: totalSeconds,
          totalAllocated: totalSeconds,
          startTime: Date.now(),
          interval: setInterval(async () => {
            if (!activeTimers[roomId]) return;

            activeTimers[roomId].secondsLeft--;

            // Emit remaining seconds to all peers
            io.to(videoRoomId).emit("video-timer-started", {
              remaining: activeTimers[roomId].secondsLeft,
            });

            if (activeTimers[roomId].secondsLeft <= 0) {
              clearInterval(activeTimers[roomId].interval);
              delete activeTimers[roomId];

              await finalizeVideoConsultation(roomId, true); // auto end
              io.to(videoRoomId).emit("timerEnded");
            }
          }, 1000),
        };
      }

      // Broadcast initial remaining seconds
      io.to(videoRoomId).emit("video-timer-started", { remaining: activeTimers[roomId].secondsLeft });

      console.log(`⏱ Timer started for consultation ${roomId}`);
    }
  } catch (err) {
    console.error("Starting timer error:", err);
  }
});

// --- ICE candidates ---
socket.on("video-ice-candidate", ({ roomId, to, candidate }) => {
  if (to) io.to(to).emit("video-ice-candidate", { from: socket.id, candidate });
});

// --- Leave Video Room ---
socket.on("leaveVideoRoom", async ({ roomId }) => {
  const videoRoomId = `${roomId}-video`;
  io.to(videoRoomId).emit("user-left", { message: "User left the call" });
  socket.leave(videoRoomId);

  // Finalize consultation
  if (activeTimers[roomId]) {
    clearInterval(activeTimers[roomId].interval);
    await finalizeVideoConsultation(roomId); // update DB
  }
});

socket.on("endVideoCall", async ({ roomId }) => {
  if (activeTimers[roomId]) {
    clearInterval(activeTimers[roomId].interval);
    await finalizeVideoConsultation(roomId); // finalize & delete from DB
  }
});

// --- Disconnect handler ---
socket.on("disconnect", async () => {
  const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);

  for (const room of rooms) {
    if (room.endsWith("-video")) {
      const roomId = room.replace("-video", "");
      io.to(room).emit("user-left", { message: "User left the call" });

      if (activeTimers[roomId]) {
        clearInterval(activeTimers[roomId].interval);
        delete activeTimers[roomId];
      }

      try {
        await Consultation.findByIdAndDelete(roomId);
        console.log(`🗑 Consultation ${roomId} deleted on disconnect`);
      } catch (err) {
        console.error("Error deleting consultation:", err);
      }
    }
  }
});

// --- Extend Video Timer ---
socket.on("extendVideoTimer", async ({ roomId, extendMinutes }) => {
  const videoRoomId = `${roomId}-video`;

  try {
    const consultation = await Consultation.findById(roomId);
    if (!consultation?.timer || !activeTimers[roomId]) return;

    const addSeconds = extendMinutes * 60;
    activeTimers[roomId].secondsLeft += addSeconds;
    activeTimers[roomId].totalAllocated += addSeconds;

    // Update durationMinutes in DB
    const talkedSeconds = activeTimers[roomId].totalAllocated - activeTimers[roomId].secondsLeft;
    consultation.timer.durationMinutes = Math.ceil((talkedSeconds + activeTimers[roomId].secondsLeft) / 60);
    await consultation.save();

    // Emit updated remaining seconds
    io.to(videoRoomId).emit("video-timer-started", { remaining: activeTimers[roomId].secondsLeft });

    console.log(`⏱ Video timer extended by ${extendMinutes} min for consultation ${roomId}`);
  } catch (err) {
    console.error("Error extending video consultation timer:", err);
  }
});

async function finalizeVideoConsultation(roomId, endedByTimer = false) {
  try {
    const consultation = await Consultation.findById(roomId);
    if (!consultation) return;

    let talkedSeconds = 0;
    if (activeTimers[roomId]) {
      talkedSeconds = activeTimers[roomId].totalAllocated - activeTimers[roomId].secondsLeft;
      clearInterval(activeTimers[roomId].interval);
      delete activeTimers[roomId];
    }

    // --- Update consultation ---
    consultation.timer = consultation.timer || {};
    consultation.timer.isRunning = false;
    consultation.talkTime = formatClock(talkedSeconds); // actual time used
    await consultation.save();

    // Delete consultation if call ended manually
    if (!endedByTimer) {
      await Consultation.findByIdAndDelete(roomId);
      console.log(`🗑 Consultation ${roomId} deleted`);
    }

    io.to(`${roomId}-video`).emit("consultationEnded", {
      consultationId: roomId,
      talkTime: consultation.talkTime,
    });

  } catch (err) {
    console.error("finalizeVideoConsultation error:", err);
  }
}





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
      totalAllocated: seconds,
      startTime: Date.now(),
      interval: setInterval(async () => {
        if (!activeTimers[roomId]) return;

        activeTimers[roomId].secondsLeft--;
        io.to(roomId).emit("timerUpdate", {
          secondsLeft: activeTimers[roomId].secondsLeft,
        });

        if (activeTimers[roomId].secondsLeft <= 0) {
          await finalizeConsultation(roomId, true); // auto end
          io.to(roomId).emit("timerEnded");
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

  // --- Format seconds to MM:SS ---
  function formatClock(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function clockToSeconds(clock) {
    const [m, s] = clock.split(":").map(Number);
    return m * 60 + s;
  }

  // --- Save talk time into Consultation + Astrologer + Admin
async function finalizeConsultation(roomId, endedByTimer = false) {
  try {
    const c = await Consultation.findById(roomId);
    if (!c?.timer) return;

    const timer = activeTimers[roomId];
    if (!timer) return;

    // --- Actual talked seconds
    const talkedSeconds = timer.totalAllocated - timer.secondsLeft;
    const talkedClock = formatClock(talkedSeconds);

    // ✅ Save consultation data
    c.timer.isRunning = false;
    c.talkTime = talkedClock; 
    await c.save();

    // ✅ Update astrologer stats
    const astro = await Astrologer.findById(c.astrologerId);
    if (astro) {
      const prevSeconds = clockToSeconds(astro.totalTalkTime || "00:00");
      const newTotalSeconds = prevSeconds + talkedSeconds;

      astro.totalTalkTime = formatClock(newTotalSeconds);
      await astro.save();
    }

    // ✅ Save unused to Admin
    const unused = timer.secondsLeft;
    if (unused > 0) {
      await Admin.updateOne(
        {},
        {
          $inc: { remainingSeconds: unused },
          $set: { remainingTime: formatClock(unused) },
        }
      );
    }

    // ✅ Emit to both ends with talkTime
    io.to(roomId).emit("consultationEnded", {
      consultationId: roomId,
      talkTime: talkedClock,
    });

    delete activeTimers[roomId];
  } catch (err) {
    console.error("finalizeConsultation error:", err);
  }
}

});



// --- Server listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
