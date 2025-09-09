const express = require("express");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const Order = require("../models/Order");

const router = express.Router();
require('dotenv').config();

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const cashfree = new Cashfree(
  process.env.NODE_ENV === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);

const generateOrderId = () => "ORDER_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

const mapStatus = (status) => {
  switch (status) {
    case "PAID": return "paid";
    case "FAILED": return "failed";
    case "EXPIRED": return "cancelled";
    default: return status.toLowerCase();
  }
};

// ---------------- CREATE ORDER ----------------
router.post("/create-order", async (req, res) => {
  try {
    const { userId, productId, amount, name, email, phone, address, city, state, pincode } = req.body;

    if (!userId || !productId || !amount || !name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = generateOrderId();

    // Save full order info in DB
    const order = new Order({
      userId,
      productId,
      orderId,
      amount,
      status: "pending",
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    });
    await order.save();

    // Prepare Cashfree order
    const orderData = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `USER_${userId}`,
        customer_phone: phone,
        customer_name: name,
        customer_email: email,
      },
      order_meta: {
        return_url: `https://www.astrobhavana.com/order-success?order_id=${orderId}`,
        notify_url: `https://yourbackend.com/api/orders/webhook`,
      },
    };

    const cfResponse = await cashfree.PGCreateOrder(orderData);

    if (cfResponse.data.payment_session_id) {
      res.json({
        success: true,
        orderId,
        paymentSessionId: cfResponse.data.payment_session_id,
      });
    } else {
      order.status = "failed";
      await order.save();
      throw new Error("Failed to create payment session");
    }
  } catch (error) {
    console.error("Order create error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

// ---------------- VERIFY ORDER ----------------
router.post("/verify", async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });

    const cfResponse = await cashfree.PGFetchOrder(orderId);
    const orderStatus = cfResponse.data.order_status;
    const paymentDetails = cfResponse.data.payment_details || {};

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = mapStatus(orderStatus);
    order.paymentId = paymentDetails.payment_id || order.paymentId;
    order.paymentMethod = paymentDetails.payment_method || order.paymentMethod;
    order.paymentTime = paymentDetails.payment_time || order.paymentTime;

    await order.save();

    res.json({ success: true, orderStatus, order });
  } catch (error) {
    console.error("Order verify error:", error);
    res.status(500).json({ message: "Failed to verify order", error: error.message });
  }
});

// ---------------- WEBHOOK ----------------
router.post("/webhook", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !data.order || !data.payment)
      return res.status(400).json({ message: "Invalid webhook payload" });

    const orderId = data.order.order_id;
    const orderStatus = data.payment.payment_status;

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = mapStatus(orderStatus);
    order.paymentId = data.payment.cf_payment_id;
    order.paymentMethod = data.payment.payment_group || "unknown";
    order.paymentTime = data.payment.payment_time;

    await order.save();

    res.json({ success: true, message: "Webhook processed", orderId, status: orderStatus });
  } catch (error) {
    console.error("Order webhook error:", error);
    res.status(500).json({ success: false, message: "Failed to process webhook", error: error.message });
  }
});

module.exports = router;
