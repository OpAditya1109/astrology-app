const express = require("express");
const axios = require("axios");
const router = express.Router();

const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_BASE_URL = "https://api.cashfree.com/pg"; // Production

router.post("/create-order", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const orderId = "order_" + Date.now();

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,   // ✅ correct route
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: userId,
          customer_email: "test@example.com",
          customer_phone: "9876543210",
        },
      },
      {
        headers: {
          "x-client-id": CASHFREE_CLIENT_ID,
          "x-client-secret": CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",   // ✅ mandatory
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Cashfree Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment order creation failed" });
  }
});

module.exports = router;
