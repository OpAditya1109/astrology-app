const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const User = require("../models/User");
const { creditAdminWallet } = require("../controllers/adminController"); // Admin wallet helper
const sendEmail = require("../utils/email"); // Import email helper
const Astrologer = require("../models/Astrologer");

router.post("/", async (req, res) => {
  try {
    const { userId, userName, astrologerId, topic, mode, rate, kundaliUrl } = req.body;

    // 1️⃣ Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Deduct first 5 min
    const first5MinCost = rate * 5;
    if (user.wallet.balance < first5MinCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.wallet.balance -= first5MinCost;
    user.wallet.transactions.push({
      type: "debit",
      amount: first5MinCost,
      description: `First 5 min ${mode} consultation`,
    });
    await user.save();

    // 3️⃣ Credit admin wallet
    await creditAdminWallet({
      amount: first5MinCost,
      description: `First 5 min payment from ${user.name}`,
      referenceId: astrologerId,
    });

    // 4️⃣ Check if consultation already exists
    let consultation = await Consultation.findOne({ userId, astrologerId });
    if (!consultation) {
      // 5️⃣ Create new consultation
      consultation = new Consultation({
        userId,
        astrologerId,
        topic,
        mode,
        bookedAt: new Date(),
        messages: [],
        status: "ongoing",
        kundaliUrl: kundaliUrl || null,
      });

      await consultation.save();
    }

    // --- EMIT SOCKET EVENT ---
    const io = req.app.get("io");
    io.to(astrologerId.toString()).emit("newConsultation", {
      _id: consultation._id,
      userId,
      userName,
      topic,
      mode: consultation.mode,
      bookedAt: consultation.bookedAt,
      status: consultation.status,
      kundaliUrl: consultation.kundaliUrl,
    });

    // --- SEND EMAIL TO ASTROLOGER ---
    try {
      const astrologer = await Astrologer.findById(astrologerId);
      if (astrologer?.email) {
        const emailSubject = "New Consultation Booked";
        const emailBody = `
Hello ${astrologer.name},

A new ${mode} consultation has been booked.

Topic: "${topic}"
Booked At: ${consultation.bookedAt.toLocaleString()}

Please check your dashboard to start the consultation.

Thanks,
Bhavana Astro
        `;
        await sendEmail(astrologer.email, emailSubject, emailBody);
      }
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
    }

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create consultation" });
  }
});


// ➤ Get all consultations for an astrologer
router.get("/:astrologerId", async (req, res) => {
  try {
    const consultations = await Consultation.find({
      astrologerId: req.params.astrologerId,
    })
      .populate("userId", "name email dob")
      .sort({ bookedAt: -1 })
      .lean();

    const mapped = consultations.map((c) => ({
      _id: c._id,
      userId: c.userId._id,
      userName: c.userId.name,
      topic: c.topic,
      bookedAt: c.bookedAt,
      mode: c.mode,
      status: c.status || "ongoing",
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

// ➤ Get consultation by ID (with messages)
router.get("/details/:consultationId", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId)
      .populate("userId", "name email dob")
      .populate("astrologerId", "name email");

    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json(consultation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
});

// ➤ Add a new message to consultation
router.post("/:consultationId/messages", async (req, res) => {
  try {
    const { sender, text } = req.body;

    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    consultation.messages.push({ sender, text });
    await consultation.save();

    res.status(201).json(consultation.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ➤ Get all messages of a consultation
router.get("/:consultationId/messages", async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.consultationId);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    res.json(consultation.messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// DELETE consultation by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const deleted = await Consultation.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Consultation not found" });
//     }
//     res.json({ message: "Consultation ended and deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// ➤ End consultation and update astrologer stats
router.post("/:id/end", async (req, res) => {
  try {
    const { duration } = req.body; // in minutes

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ error: "Consultation not found" });

    consultation.status = "completed";
    consultation.endTime = new Date();
    consultation.duration = duration;
    await consultation.save();

    // Update astrologer stats
    const astro = await Astrologer.findById(consultation.astrologerId);

    if (consultation.mode === "chat") {
      astro.stats.totalChats += 1;
      astro.stats.chatMinutes += duration;
    }
    if (consultation.mode === "video") {
      astro.stats.totalVideos += 1;
      astro.stats.videoMinutes += duration;
    }
    if (consultation.mode === "audio") {
      astro.stats.totalAudios += 1;
      astro.stats.audioMinutes += duration;
    }

    // track unique customer
    if (!astro.stats.uniqueCustomers.includes(consultation.userId)) {
      astro.stats.uniqueCustomers.push(consultation.userId);
      astro.stats.totalCustomers = astro.stats.uniqueCustomers.length;
    }

    await astro.save();

    res.json({ message: "Consultation ended", consultation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to end consultation" });
  }
});

module.exports = router;
