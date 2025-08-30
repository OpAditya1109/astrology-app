const express = require("express");
const router = express.Router();

const CASHFREE_URL = "https://api.cashfree.com/pg/orders"; // ✅ Production URL
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// ✅ Safety check
if (!CASHFREE_CLIENT_ID || !CASHFREE_SECRET_KEY) {
  console.error("❌ Missing Cashfree credentials. Check your .env file.");
}

// Example in Express
router.post("/create-order", async (req, res) => {
  const { amount, userId } = req.body;

  const orderResponse = await fetch("https://api.cashfree.com/pg/orders", {
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
      order_amount: amount,
      customer_details: { customer_id: userId },
    }),
  });

  const data = await orderResponse.json();

  res.json({
    success: true,
    paymentsUrl: data.payments.url, // <-- this is what frontend will redirect to
  });
});


module.exports = router;
