const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');

const router = express.Router();

// Razorpay config
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Helper to generate receipt ID (Razorpay calls it "receipt", max 40 chars)
const generateReceiptId = () =>
  'WLT_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

// Helper to map Razorpay status to DB status
const mapStatus = (status) => {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'failed':
      return 'failed';
    case 'created':
    case 'attempted':
      return 'pending';
    default:
      return status.toLowerCase();
  }
};

// Prevent duplicate wallet credits
async function creditWalletOnce(userId, amount, paymentId) {
  if (!paymentId) return; // Safety check

  const result = await User.updateOne(
    { _id: userId, 'wallet.transactions.paymentId': { $ne: paymentId } }, // Atomic check
    {
      $inc: { 'wallet.balance': amount },
      $push: {
        'wallet.transactions': {
          type: 'credit',
          amount,
          description: 'Wallet recharge',
          paymentId,
          date: new Date(),
        },
      },
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`Wallet credited for user ${userId}: ₹${amount}, paymentId: ${paymentId}`);
  } else {
    console.log(`Wallet already credited or paymentId exists: ${paymentId}`);
  }
}

// ------------------- TOPUP -------------------
// Creates a Razorpay order and returns order_id + key_id to frontend
router.post('/topup', async (req, res) => {
  try {
    const { userId, amount, phone, name, email } = req.body;

    if (!userId || !amount)
      return res.status(400).json({ message: 'User ID and amount are required' });
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET)
      return res.status(500).json({ message: 'Razorpay configuration missing' });

    const receiptId = generateReceiptId();

    // Save transaction as pending
    const transaction = new WalletTransaction({
      userId,
      orderId: receiptId,   // we store receipt as our orderId reference
      amount,
      status: 'pending',
    });
    await transaction.save();
    console.log(`Transaction created: ${receiptId}, status: pending`);

    // Create Razorpay order (amount must be in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId,
        walletTopup: 'true',
      },
    });

    console.log(`Razorpay order created: ${razorpayOrder.id}`);

    // Update transaction with Razorpay order id
    transaction.razorpayOrderId = razorpayOrder.id;
    await transaction.save();

    res.json({
      success: true,
      orderId: receiptId,           // our internal order reference
      razorpayOrderId: razorpayOrder.id,  // pass to frontend Razorpay checkout
      keyId: RAZORPAY_KEY_ID,       // frontend needs the key
      amount: razorpayOrder.amount, // amount in paise
      currency: razorpayOrder.currency,
      name: name || 'User',
      email: email || '',
      phone: phone || '',
    });
  } catch (error) {
    console.error('Wallet topup error:', error);
    res.status(500).json({ message: 'Failed to initiate wallet top-up', error: error.message });
  }
});

// ------------------- VERIFY -------------------
// Called after Razorpay checkout success — verifies signature and credits wallet
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId)
      return res.status(400).json({ message: 'Missing payment verification fields' });

    // Signature verification
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Fetch payment details from Razorpay to get method and time
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = mapStatus(payment.status);
    transaction.paymentId = razorpay_payment_id;
    transaction.paymentMethod = payment.method || 'unknown';
    transaction.paymentTime = new Date(payment.created_at * 1000).toISOString();
    transaction.paymentMessage = payment.description || '';

    await transaction.save();
    console.log(`Transaction verified: ${orderId}, status: ${transaction.status}`);

    // Credit wallet if paid
    if (transaction.status === 'paid') {
      await creditWalletOnce(transaction.userId, transaction.amount, razorpay_payment_id);
    }

    res.json({ success: true, orderStatus: transaction.status.toUpperCase(), transaction });
  } catch (error) {
    console.error('Wallet verify error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
});

// ------------------- WEBHOOK -------------------
// Razorpay webhook — configure in Razorpay dashboard → Webhooks → payment.captured / payment.failed
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (webhookSecret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.body) // raw body buffer
        .digest('hex');

      if (generatedSignature !== signature) {
        console.warn('Webhook signature mismatch');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const payload = JSON.parse(req.body);
    const event = payload.event;
    console.log('Wallet webhook received event:', event);

    // Only handle payment captured/failed events
    if (!['payment.captured', 'payment.failed'].includes(event)) {
      return res.json({ success: true, message: 'Event ignored' });
    }

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity) return res.status(400).json({ success: false, message: 'Invalid webhook payload' });

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;
    const paymentStatus = paymentEntity.status; // 'captured' or 'failed'
    const orderAmount = paymentEntity.amount / 100; // paise → rupees

    // Find transaction by razorpayOrderId
    const transaction = await WalletTransaction.findOne({ razorpayOrderId });
    if (!transaction)
      return res.status(404).json({ success: false, message: 'Transaction not found' });

    transaction.status = paymentStatus === 'captured' ? 'paid' : 'failed';
    transaction.paymentId = razorpayPaymentId;
    transaction.paymentMethod = paymentEntity.method || 'unknown';
    transaction.paymentTime = new Date(paymentEntity.created_at * 1000).toISOString();
    transaction.paymentMessage = paymentEntity.description || '';

    await transaction.save();
    console.log(`Webhook updated transaction: ${transaction.orderId}, status: ${transaction.status}`);

    // Credit wallet if captured
    if (transaction.status === 'paid') {
      await creditWalletOnce(transaction.userId, orderAmount, razorpayPaymentId);
    }

    res.json({ success: true, message: 'Webhook processed', orderId: transaction.orderId, status: transaction.status });
  } catch (error) {
    console.error('Wallet webhook error:', error);
    res.status(500).json({ success: false, message: 'Failed to process webhook', error: error.message });
  }
});

// ------------------- STATUS -------------------
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await WalletTransaction.findOne({ orderId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    // If still pending, fetch from Razorpay using razorpayOrderId
    if (transaction.status === 'pending' && transaction.razorpayOrderId) {
      const rzpOrder = await razorpay.orders.fetch(transaction.razorpayOrderId);
      transaction.status = mapStatus(rzpOrder.status);
      await transaction.save();
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Wallet status error:', error);
    res.status(500).json({ message: 'Failed to get transaction status', error: error.message });
  }
});

module.exports = router;