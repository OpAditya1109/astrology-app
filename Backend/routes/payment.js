<<<<<<< HEAD
import express from "express";
import fetch from "node-fetch";

=======
const express = require("express");
const axios = require("axios");
>>>>>>> ac3ebb4e8127491f1f5433e7a0e40ad97612f1c1
const router = express.Router();

const CASHFREE_URL = "https://api.cashfree.com/pg/orders"; // ✅ Production
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
<<<<<<< HEAD

router.post("/create-order", async (req, res) => {
  try {
    const { amount, userId } = req.body;
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
=======
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
>>>>>>> ac3ebb4e8127491f1f5433e7a0e40ad97612f1c1
        order_currency: "INR",
        order_amount: amount,
        customer_details: {
          customer_id: userId,
          customer_phone: "9898989898", // real customer phone
          customer_email: "test@example.com", // real customer email
        },
<<<<<<< HEAD
      }),
    });

    const data = await response.json();

    if (data.payment_session_id) {
      res.json({ sessionId: data.payment_session_id });
    } else {
      res.status(400).json({ error: "Cashfree did not return session ID", data });
    }
=======
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
>>>>>>> ac3ebb4e8127491f1f5433e7a0e40ad97612f1c1
  } catch (err) {
    console.error("❌ Payment Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
