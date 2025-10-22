const express = require("express");
const axios = require("axios");
const router = express.Router();

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

router.post("/create", async (req, res) => {
  try {
    const { orderId, amount, priceCurrency = "INR", payCurrency = "shib" } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "Missing amount or orderId" });
    }

    const invoicePayload = {
      price_amount: parseFloat(amount),
      price_currency: priceCurrency.toLowerCase(),
      pay_currency: payCurrency.toLowerCase(),
      order_id: orderId,
      order_description: "AstroBhavana Recharge / Booking",
      ipn_callback_url: "https://bhavanaastro.onrender.com/api/cryptopayment/webhook",
      success_url: "https://www.astrobhavana.com/payment-success",
      cancel_url: "https://www.astrobhavana.com/payment-cancel",
    };

    const headers = {
      "x-api-key": NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json",
    };

    // ✅ Fast request with 5-second timeout
    const nowRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      invoicePayload,
      { headers, timeout: 5000 }
    );

    const paymentUrl = nowRes?.data?.invoice_url;
    if (!paymentUrl) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate crypto invoice",
      });
    }

    // ✅ Respond immediately
    res.status(200).json({ success: true, paymentUrl });

    // 🔹 Optional: log invoice asynchronously (won’t delay response)
    // logInvoiceToDB(nowRes.data).catch(console.error);

  } catch (err) {
    console.error("NOWPayments error:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Server error creating crypto payment",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
