const express = require("express");
const axios = require("axios");
const router = express.Router();

// ✅ Load from .env
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;

// ✅ POST /api/cryptopayment/create
router.post("/create", async (req, res) => {
  try {
    const {
      orderId,
      amount,
      priceCurrency = "INR", // default USD
      payCurrency = "shib", // ✅ default Shiba Inu
    } = req.body;

    if (!amount || !orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing amount or orderId" });
    }

    // ✅ Create invoice payload
    const invoicePayload = {
      price_amount: parseFloat(amount),
      price_currency: priceCurrency.toLowerCase(),
      pay_currency: payCurrency.toLowerCase(),
      order_id: orderId,
      order_description: "AstroBhavana Recharge / Booking",
      ipn_callback_url:
        "https://bhavanaastro.onrender.com/api/cryptopayment/webhook",
      success_url: "https://www.astrobhavana.com/payment-success",
      cancel_url: "https://www.astrobhavana.com/payment-cancel",
    };

    // ✅ Headers
    const headers = {
      "x-api-key": NOWPAYMENTS_API_KEY,
      "Content-Type": "application/json",
    };

    // ✅ Create invoice
    const nowRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      invoicePayload,
      { headers }
    );

    console.log("NOWPayments response:", nowRes.data);

    if (nowRes.data && nowRes.data.invoice_url) {
      return res.status(200).json({
        success: true,
        paymentUrl: nowRes.data.invoice_url,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to generate crypto invoice",
        nowResponse: nowRes.data,
      });
    }
  } catch (err) {
    console.error("NOWPayments error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Server error creating crypto payment",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
