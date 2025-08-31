const express = require('express');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const WalletTransaction = require('../models/WalletTransaction'); // Create this model

const router = express.Router();


// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);
console.log("Cashfree ENV:", process.env.NODE_ENV === 'production' ? "PRODUCTION" : "SANDBOX");
console.log("App ID:", CASHFREE_APP_ID);
console.log("Secret Key:", CASHFREE_SECRET_KEY);
// Helper: generate unique orderId
const generateOrderId = () => 'WALLET_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// POST /api/wallet/recharge - create wallet transaction & initiate payment
router.post('/recharge', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ message: 'User ID and amount are required' });
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.status(500).json({ message: 'Cashfree credentials missing' });
    }

    const orderId = generateOrderId();

    // Save transaction in DB
    const transaction = new WalletTransaction({
      userId,
      orderId,
      amount,
      status: 'pending'
    });
    await transaction.save();

    // Create Cashfree order
   const orderData = {
  order_amount: 11,
  order_currency: "INR",
  order_id: orderId,
  customer_details: {
    customer_id: "USER_12345",
    customer_phone: "9876543210",   // <--- add this
    customer_email: "user@example.com"
  },
  order_meta: {
    return_url: `http://localhost:5173/wallet-success?order_id=${orderId}`,
    notify_url: "http://localhost:5000/api/wallet/webhook"
  }
};

// Log the full response to check what Cashfree returns

   const cashfreeResponse = await cashfree.PGCreateOrder(orderData);

// Construct the payment URL manually using payment_session_id
const paymentUrl = `https://sandbox.cashfree.com/pg/orders/${cashfreeResponse.data.payment_session_id}`;

// Log it
console.log("Payment URL:", paymentUrl);

res.json({
  success: true,
  paymentUrl, // now frontend will get a valid URL
  orderId
});


  } catch (error) {
    console.error('Wallet recharge error:', error);
    res.status(500).json({ message: 'Failed to create wallet transaction', error: error.message });
  }
});

// POST /api/wallet/verify - verify payment
router.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    const transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // Update transaction based on status
    switch (orderStatus) {
      case 'PAID':
        transaction.status = 'paid';
        transaction.paymentId = paymentDetails.payment_id || paymentDetails.auth_id;
        transaction.paymentMethod = paymentDetails.payment_method;
        transaction.paymentTime = paymentDetails.payment_time;
        transaction.bankReference = paymentDetails.bank_reference;
        break;
      case 'EXPIRED':
        transaction.status = 'cancelled';
        break;
      case 'FAILED':
        transaction.status = 'failed';
        transaction.paymentMessage = paymentDetails.payment_message;
        break;
      case 'PENDING':
        transaction.status = 'pending';
        break;
      default:
        transaction.status = orderStatus.toLowerCase();
    }

    await transaction.save();

    res.json({ success: true, orderStatus, transaction });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment', error: error.message });
  }
});

// POST /api/wallet/webhook - handle Cashfree webhooks
router.post('/webhook', async (req, res) => {
  try {
    const { orderId, orderStatus, paymentId, paymentMethod, paymentTime, bankReference, authId, paymentMessage } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    const transaction = await WalletTransaction.findOne({ orderId });
    if (transaction) {
      switch (orderStatus) {
        case 'PAID':
          transaction.status = 'paid';
          transaction.paymentId = paymentId || authId;
          transaction.paymentMethod = paymentMethod;
          transaction.paymentTime = paymentTime;
          transaction.bankReference = bankReference;
          break;
        case 'EXPIRED':
          transaction.status = 'cancelled';
          break;
        case 'FAILED':
          transaction.status = 'failed';
          transaction.paymentMessage = paymentMessage;
          break;
        case 'PENDING':
          transaction.status = 'pending';
          break;
        default:
          transaction.status = orderStatus.toLowerCase();
      }
      await transaction.save();
    }

    res.json({ success: true, message: 'Webhook processed', orderId, status: orderStatus });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Failed to process webhook', error: error.message });
  }
});

// GET /api/wallet/status/:orderId - get wallet transaction status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Get wallet status error:', error);
    res.status(500).json({ message: 'Failed to get transaction status', error: error.message });
  }
});

module.exports = router;
