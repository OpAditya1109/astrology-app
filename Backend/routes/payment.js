// routes/payment.js (or cashfreeRoutes.js)
const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

const CASHFREE_URL = "https://api.cashfree.com/pg/orders"; // ✅ Production URL
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// ✅ Safety check
if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
  console.error("❌ Missing Cashfree credentials. Check your .env file.");
}

router.post("/create-order", async (req, res) => {
  try {
    const { amount, userId, customerPhone, customerEmail } = req.body;

    if (!amount || !userId) {
      return res.status(400).json({ error: "Amount and User ID are required" });
    }

    const orderId = "order_" + Date.now();

 // ✅ No require/import needed in Node 18+
const response = await fetch("https://api.cashfree.com/pg/orders", {
  method: "POST",
  headers: {
    "x-api-version": "2022-09-01",
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    order_id: "order_" + Date.now(),
    order_currency: "INR",
    order_amount: 100,
    customer_details: {
      customer_id: "12345",
      customer_phone: "9999999999",
      customer_email: "test@example.com",
    },
  }),
});


console.log(data);


    const data = await response.json();

    if (response.ok && data.payment_session_id) {
      res.json({
        success: true,
        orderId,
        sessionId: data.payment_session_id,
      });
    } else {
      res.status(400).json({
        success: false,
        error: data.message || "Cashfree did not return session ID",
        raw: data,
      });
    }
  } catch (err) {
    console.error("❌ Payment Error:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router; // ✅ CommonJS export
