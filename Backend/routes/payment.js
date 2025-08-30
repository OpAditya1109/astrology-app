const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set Cashfree credentials
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
// Change to SANDBOX for testing, PRODUCTION for live
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

// Generate unique order ID
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  return hash.digest('hex').substr(0, 12);
}

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create payment session for JS SDK
app.get('/payment', async (req, res) => {
  try {
    const orderId = generateOrderId();

    const request = {
      order_amount: 1.0, // Amount in INR
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: "webcodder01",
        customer_phone: "9999999999",
        customer_name: "Web Codder",
        customer_email: "webcodder@example.com"
      },
      order_meta: {
        return_url: "http://localhost:3000" // Your frontend URL
      }
    };

    // Create order via Cashfree SDK
    const response = await Cashfree.PGCreateOrder(Cashfree.XEnvironment, request);

    console.log("Cashfree Response:", response.data);

    if (response.data.payment_session_id) {
      res.json({
        order_id: orderId,
        payment_session_id: response.data.payment_session_id
      });
    } else {
      res.status(400).json({ error: "Payment session ID not returned", raw: response.data });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

// Verify payment
app.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: "orderId is required" });

    const response = await Cashfree.PGOrderFetchPayments(Cashfree.XEnvironment, orderId);
    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

