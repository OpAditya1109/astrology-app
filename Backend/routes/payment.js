  const express = require('express');
  const { Cashfree, CFEnvironment } = require('cashfree-pg');
  const WalletTransaction = require('../models/WalletTransaction');

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
  const generateOrderId = () => 'WALLET_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // POST /api/wallet/topup - initiate wallet recharge
  router.post('/topup', async (req, res) => {
    try {
      const { userId, amount } = req.body;

      if (!userId || !amount) {
        return res.status(400).json({ message: 'User ID and amount are required' });
      }

      if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
        return res.status(500).json({ message: 'Cashfree configuration missing' });
      }

      const orderId = generateOrderId();

      // Create wallet transaction in DB
      const transaction = new WalletTransaction({
        userId,
        orderId,
        amount,
        status: 'initiated'
      });

      await transaction.save();

      // Create Cashfree order
  const orderData = {
    order_amount: amount,
    order_currency: 'INR',
    order_id: orderId,
    customer_details: {
      customer_id: `USER_${userId}`,
      customer_phone: req.body.phone || '9999999999', // fallback if not provided
      customer_name: req.body.name || 'Test User',
      customer_email: req.body.email || 'test@example.com'
    },
    order_meta: {
      return_url: `https://www.astrobhavana.com/wallet-success?order_id=${orderId}`,
      notify_url: `https://bhavanaastro.onrender.com/api/wallet/webhook`,
      payment_methods: 'cc,dc,upi'
    }
  };


      const cashfreeResponse = await cashfree.PGCreateOrder(orderData);

      if (cashfreeResponse.data.payment_session_id) {
        res.json({
          success: true,
          orderId,
               paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
        });
      } else {
        throw new Error('Failed to create payment session');
      }

    } catch (error) {
      console.error('Wallet topup error:', error);
      res.status(500).json({ message: 'Failed to initiate wallet top-up', error: error.message });
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

      switch (orderStatus) {
        case 'PAID':
          transaction.status = 'paid';
          transaction.paymentId = paymentDetails.payment_id || paymentDetails.auth_id;
          transaction.paymentMethod = paymentDetails.payment_method;
          transaction.paymentTime = paymentDetails.payment_time;
          break;
        case 'FAILED':
          transaction.status = 'failed';
          transaction.paymentMessage = paymentDetails.payment_message;
          break;
        case 'EXPIRED':
          transaction.status = 'cancelled';
          break;
        default:
          transaction.status = orderStatus.toLowerCase();
      }

      await transaction.save();

      res.json({ success: true, orderStatus, transaction });
    } catch (error) {
      console.error('Wallet verify error:', error);
      res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
  });

  // POST /api/wallet/webhook - handle Cashfree webhook
  router.post('/webhook', async (req, res) => {
    try {
      console.log('Wallet webhook received:', req.body);
      const { orderId, orderStatus, paymentId, paymentMethod, paymentTime, paymentMessage } = req.body;

      const transaction = await WalletTransaction.findOne({ orderId });
      if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

      switch (orderStatus) {
        case 'PAID':
          transaction.status = 'paid';
          transaction.paymentId = paymentId;
          transaction.paymentMethod = paymentMethod;
          transaction.paymentTime = paymentTime;
          break;
        case 'FAILED':
          transaction.status = 'failed';
          transaction.paymentMessage = paymentMessage;
          break;
        case 'EXPIRED':
          transaction.status = 'cancelled';
          break;
        default:
          transaction.status = orderStatus.toLowerCase();
      }

      await transaction.save();
      res.json({ success: true, message: 'Webhook processed', orderId, status: orderStatus });
    } catch (error) {
      console.error('Wallet webhook error:', error);
      res.status(500).json({ message: 'Failed to process webhook', error: error.message });
    }
  });

  // GET /api/wallet/status/:orderId - get transaction status
  router.get('/status/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const transaction = await WalletTransaction.findOne({ orderId });
      if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

      res.json({ success: true, transaction });
    } catch (error) {
      console.error('Wallet status error:', error);
      res.status(500).json({ message: 'Failed to get transaction status', error: error.message });
    }
  });

  module.exports = router;
