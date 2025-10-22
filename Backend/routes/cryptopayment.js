// routes/cryptopayment.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

// Load from .env
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

// POST /api/cryptopayment/create
router.post("/create", async (req, res) => {
  try {
    const { orderId, amount, priceCurrency, payCurrency } = req.body;

    const invoicePayload = {
      price_amount: amount,                       // e.g. 499.00
      price_currency: priceCurrency,              // "INR" or "USD"
      pay_currency: payCurrency,                  // "SHIB", "USDT", etc.
      order_id: orderId,
      order_description: "AstroBhavana Booking",
      ipn_callback_url: "https://yourdomain.com/api/cryptopayment/webhook",
      success_url: "https://yourdomain.com/payment-success",
      cancel_url: "https://yourdomain.com/payment-cancel"
    };

    const headers = {
      "x-api-key": NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json"
    };

    const nowRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      invoicePayload,
      { headers }
    );

    if (nowRes.data && nowRes.data.invoice_url) {
      res.status(200).json({
        success: true,
        paymentUrl: nowRes.data.invoice_url
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate crypto invoice"
      });
    }

  } catch (err) {
    console.error("NOWPayments error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Server error creating crypto payment"
    });
  }
});

module.exports = router;
