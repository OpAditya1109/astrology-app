const express = require('express');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');

const router = express.Router();

// Cashfree config
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);

// Helper to generate order ID
const generateOrderId = () =>
  'WALLET_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Helper to map Cashfree status to DB status
const mapStatus = (status) => {
  switch (status) {
    case 'PAID':
      return 'paid';
    case 'FAILED':
      return 'failed';
    case 'EXPIRED':
      return 'cancelled';
    default:
      return status.toLowerCase();
  }
};

// Prevent duplicate wallet credits
async function creditWalletOnce(userId, amount, paymentId) {
  const user = await User.findById(userId);
  if (!user) return;

  const alreadyCredited = user.wallet.transactions.some(
    (tx) => tx.paymentId === paymentId
  );

  if (!alreadyCredited) {
    await User.findByIdAndUpdate(userId, {
      $inc: { 'wallet.balance': amount },
      $push: {
        'wallet.transactions': {
          type: 'credit',
          amount,
          description: 'Wallet recharge',
          paymentId,
        },
      },
    });
    console.log(`Wallet credited for user ${userId}: ₹${amount}`);
  } else {
    console.log(`Wallet already credited for paymentId: ${paymentId}`);
  }
}

// ------------------- TOPUP -------------------
router.post('/topup', async (req, res) => {
  try {
    const { userId, amount, phone, name, email } = req.body;

    if (!userId || !amount)
      return res.status(400).json({ message: 'User ID and amount are required' });
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY)
      return res.status(500).json({ message: 'Cashfree configuration missing' });

    const orderId = generateOrderId();

    // Save transaction as pending
    const transaction = new WalletTransaction({
      userId,
      orderId,
      amount,
      status: 'pending',
    });
    await transaction.save();
    console.log(`Transaction created: ${orderId}, status: pending`);

    // Create Cashfree order
    const orderData = {
      order_amount: amount,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `USER_${userId}`,
        customer_phone: phone || '9999999999',
        customer_name: name || 'Test User',
        customer_email: email || 'test@example.com',
      },
      order_meta: {
        return_url: `https://www.astrobhavana.com/wallet-success?order_id=${orderId}`,
        notify_url: `https://bhavanaastro.onrender.com/api/wallet/webhook`,
        payment_methods: 'cc,dc,upi',
      },
    };

    const cashfreeResponse = await cashfree.PGCreateOrder(orderData);

    if (cashfreeResponse.data.payment_session_id) {
      console.log(`Cashfree order created: ${orderId}`);
      res.json({
        success: true,
        orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id,
      });
    } else {
      transaction.status = 'failed';
      await transaction.save();
      console.log(`Failed to create Cashfree order: ${orderId}`);
      throw new Error('Failed to create payment session');
    }
  } catch (error) {
    console.error('Wallet topup error:', error);
    res.status(500).json({ message: 'Failed to initiate wallet top-up', error: error.message });
  }
});

// ------------------- VERIFY -------------------
router.post('/verify', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    const transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = mapStatus(orderStatus);
    transaction.paymentId = paymentDetails.payment_id || transaction.paymentId;
    transaction.paymentMethod = paymentDetails.payment_method || transaction.paymentMethod;
    transaction.paymentTime = paymentDetails.payment_time || transaction.paymentTime;
    transaction.paymentMessage = paymentDetails.payment_message || transaction.paymentMessage;

    await transaction.save();
    console.log(`Transaction verified: ${orderId}, status: ${transaction.status}`);

    res.json({ success: true, orderStatus, transaction });
  } catch (error) {
    console.error('Wallet verify error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
});

// ------------------- WEBHOOK -------------------
router.post('/webhook', async (req, res) => {
  try {
    console.log('Wallet webhook received:', req.body);

    const { data } = req.body;
    if (!data || !data.order || !data.payment)
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });

    const orderId = data.order.order_id;
    const orderAmount = data.order.order_amount;
    const rawStatus = data.payment.payment_status;
    const orderStatus = rawStatus === 'SUCCESS' ? 'PAID' : rawStatus;

    const paymentId = data.payment.cf_payment_id;
    const paymentMethod = data.payment.payment_group || 'unknown';
    const paymentTime = data.payment.payment_time;
    const paymentMessage = data.payment.payment_message;

    let transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction)
      return res.status(404).json({ success: false, message: 'Transaction not found' });

    transaction.status = mapStatus(orderStatus);
    transaction.paymentId = paymentId;
    transaction.paymentMethod = paymentMethod;
    transaction.paymentTime = paymentTime;
    transaction.paymentMessage = paymentMessage;

    await transaction.save();
    console.log(`Webhook updated transaction: ${orderId}, status: ${transaction.status}`);

    // Credit wallet if PAID
    if (transaction.status === 'paid') {
      await creditWalletOnce(transaction.userId, orderAmount, paymentId);
    }

    res.json({ success: true, message: 'Webhook processed', orderId, status: transaction.status });
  } catch (error) {
    console.error('Wallet webhook error:', error);
    res.status(500).json({ success: false, message: 'Failed to process webhook', error: error.message });
  }
});


const axios = require('axios');


router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    let transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    console.log(`Checking status for transaction: ${orderId}, current status: ${transaction.status}`);

    // Completed transactions
    if (transaction.status !== 'pending') {
      if (transaction.status === 'paid') {
        await creditWalletOnce(transaction.userId, transaction.amount, transaction.paymentId);
        console.log(`Wallet credited for transaction: ${orderId}`);
      }
      return res.json({ success: true, transaction });
    }

    // Fetch status from Cashfree
    const cfResponse = await cashfree.PGFetchOrder(orderId);
    const cfStatus = cfResponse.data.order_status;
    const paymentDetails = cfResponse.data.payment_details || {};
    console.log(`Cashfree status for ${orderId}: ${cfStatus}`);

    if (cfStatus === 'PAID') {
      transaction.status = 'paid';
      transaction.paymentId = paymentDetails.payment_id || transaction.paymentId;
      transaction.paymentMethod = paymentDetails.payment_method || transaction.paymentMethod;
      transaction.paymentTime = paymentDetails.payment_time || transaction.paymentTime;
      transaction.paymentMessage = paymentDetails.payment_message || transaction.paymentMessage;
      await transaction.save();
      await creditWalletOnce(transaction.userId, transaction.amount, transaction.paymentId);
      console.log(`Transaction marked as paid: ${orderId}`);

    } else if (cfStatus === 'FAILED') {
      transaction.status = 'failed';
      await transaction.save();
      console.log(`Transaction failed: ${orderId}`);

    } else if (cfStatus === 'EXPIRED' || cfStatus === 'CANCELLED') {
      transaction.status = 'cancelled';
      await transaction.save();
      console.log(`Transaction cancelled: ${orderId}`);

    } else if (['PENDING', 'ACTIVE', 'INITIATED'].includes(cfStatus)) {
      // Terminate pending order using REST API
      try {
        console.log(`Attempting to terminate pending order: ${orderId}`);

        const terminateUrl = `https://www.cashfree.com/pg/orders/${orderId}`;
        const terminateRes = await axios.patch(
          terminateUrl,
          { order_status: 'TERMINATED' },
          {
            headers: {
              'x-api-version': '2022-09-01', // production API version
              'x-client-id': process.env.CASHFREE_APP_ID,
              'x-client-secret': process.env.CASHFREE_SECRET_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(`Terminate Response for ${orderId}:`, terminateRes.data);

        transaction.status = 'cancelled';
        transaction.paymentMessage = 'Order terminated due to inactivity';
        await transaction.save();
        console.log(`Pending transaction terminated: ${orderId}`);
      } catch (terminateError) {
        console.error(`Error terminating pending order ${orderId}:`, terminateError.response?.data || terminateError.message);
      }
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Wallet status error:', error);
    res.status(500).json({ message: 'Failed to get transaction status', error: error.message });
  }
});





module.exports = router;
