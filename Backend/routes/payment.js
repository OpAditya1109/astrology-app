// routes/cashfreeRoutes.js
import express from "express";
import fetch from "node-fetch";

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

    const response = await fetch(CASHFREE_URL, {
      method: "POST",
      headers: {
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_CLIENT_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_currency: "INR",
        order_amount: amount,
        customer_details: {
          customer_id: userId,
          customer_phone: customerPhone || "9999999999",
          customer_email: customerEmail || "no-reply@example.com",
        },
        order_meta: {
          return_url: `https://yourfrontend.com/payment-success?order_id=${orderId}`, // ✅ redirect after payment
        },
      }),
    });

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

export default router;
