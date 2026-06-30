const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const router = express.Router();
require('dotenv').config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

const generateReceiptId = () =>
  'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

const mapStatus = (status) => {
  switch (status) {
    case 'paid':
    case 'captured':
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

// ---------------- CREATE ORDER ----------------
router.post('/create-order', async (req, res) => {
  try {
    const { userId, productId, amount, name, email, phone, address, city, state, pincode } = req.body;

    if (!userId || !productId || !amount || !name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const receiptId = generateReceiptId();

    // Save order to DB
    const order = new Order({
      userId,
      productId,
      orderId: receiptId,
      amount,
      status: 'pending',
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    });
    await order.save();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: receiptId,
      notes: { userId, productId },
    });

    // Store razorpayOrderId on the DB order for webhook lookup
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      orderId: receiptId,               // our internal order reference
      razorpayOrderId: razorpayOrder.id, // pass to frontend
      keyId: RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,     // paise
      currency: razorpayOrder.currency,
      name,
      email,
      phone,
    });
  } catch (error) {
    console.error('Order create error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// ---------------- VERIFY ORDER ----------------
// Called after Razorpay checkout success — verifies signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId)
      return res.status(400).json({ message: 'Missing payment verification fields' });

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = mapStatus(payment.status);
    order.paymentId = razorpay_payment_id;
    order.paymentMethod = payment.method || 'unknown';
    order.paymentTime = new Date(payment.created_at * 1000).toISOString();

    await order.save();

    res.json({ success: true, orderStatus: order.status.toUpperCase(), order });
  } catch (error) {
    console.error('Order verify error:', error);
    res.status(500).json({ message: 'Failed to verify order', error: error.message });
  }
});

// ---------------- RETRY PAYMENT ----------------
// Returns a fresh Razorpay order if original is still pending
router.post('/retry-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Fetch Razorpay order status
    const rzpOrder = await razorpay.orders.fetch(order.razorpayOrderId);

    if (rzpOrder.status === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    // Return same Razorpay order details for frontend to re-open checkout
    res.json({
      razorpayOrderId: rzpOrder.id,
      keyId: RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      name: order.name,
      email: order.email,
      phone: order.phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch order for retry', error: err.message });
  }
});

// ---------------- WEBHOOK ----------------
// Configure in Razorpay Dashboard → Webhooks → Events: payment.captured, payment.failed
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (webhookSecret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.body)
        .digest('hex');

      if (generatedSignature !== signature) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
      }
    }

    const payload = JSON.parse(req.body);
    const event = payload.event;
    console.log('Order webhook event:', event);

    if (!['payment.captured', 'payment.failed'].includes(event)) {
      return res.json({ success: true, message: 'Event ignored' });
    }

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity) return res.status(400).json({ message: 'Invalid webhook payload' });

    const razorpayOrderId = paymentEntity.order_id;
    const razorpayPaymentId = paymentEntity.id;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = paymentEntity.status === 'captured' ? 'paid' : 'failed';
    order.paymentId = razorpayPaymentId;
    order.paymentMethod = paymentEntity.method || 'unknown';
    order.paymentTime = new Date(paymentEntity.created_at * 1000).toISOString();

    await order.save();

    res.json({ success: true, message: 'Webhook processed', orderId: order.orderId, status: order.status });
  } catch (error) {
    console.error('Order webhook error:', error);
    res.status(500).json({ success: false, message: 'Failed to process webhook', error: error.message });
  }
});

// ---------------- GET ORDER STATUS ----------------
// Used by OrderSuccess.jsx to display order after redirect
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // If still pending, sync with Razorpay
    if (order.status === 'pending' && order.razorpayOrderId) {
      const rzpOrder = await razorpay.orders.fetch(order.razorpayOrderId);
      order.status = mapStatus(rzpOrder.status);
      await order.save();
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ message: 'Failed to get order status', error: error.message });
  }
});

module.exports = router;