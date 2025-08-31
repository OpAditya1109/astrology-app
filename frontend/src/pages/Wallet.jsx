import React, { useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");

  const userId = "USER_12345"; // Replace with logged-in user ID

  // Create wallet recharge order and start Cashfree checkout
  const handleRecharge = async () => {
    if (!amount) return alert("Enter an amount");
    setError("");

    try {
      setLoading(true);
      // 1️⃣ Create order via backend
      const res = await axios.post("https://bhavanaastro.onrender.com/api/payment/topup", {
        userId,
        amount: parseFloat(amount),
      });

      const { orderId, paymentSessionId } = res.data;

      if (!paymentSessionId) {
        setError("Payment session not received from server");
        return;
      }

      setOrderId(orderId);

      // 2️⃣ Load Cashfree JS and start checkout
      const cashfree = await load({ mode: "production" }); // change to 'production' when live
      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", // _self will redirect current tab
      });

    } catch (err) {
      console.error("Failed to create wallet recharge:", err);
      setError("Failed to initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify payment status manually
  const handleVerify = async () => {
    if (!orderId) return alert("No order ID to verify");

    try {
      setLoading(true);
      const res = await axios.post("https://bhavanaastro.onrender.com/api/payment/verify", { orderId });
      setStatus(res.data.orderStatus);
      setTransaction(res.data.transaction);
      alert(`Payment Status: ${res.data.orderStatus}`);
    } catch (err) {
      console.error(err);
      alert("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>Wallet Recharge</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", width: "80%", marginBottom: "10px" }}
      />

      <div>
        <button
          onClick={handleRecharge}
          disabled={loading || !amount}
          style={{ padding: "10px 20px", marginRight: 10 }}
        >
          {loading ? "Processing..." : "Recharge Wallet"}
        </button>

        {orderId && (
          <button onClick={handleVerify} disabled={loading} style={{ padding: "10px 20px" }}>
            Verify Payment
          </button>
        )}
      </div>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {status && transaction && (
        <div style={{ marginTop: 20, textAlign: "left" }}>
          <h3>Transaction Status</h3>
          <p><b>Status:</b> {status}</p>
          <p><b>Order ID:</b> {transaction.orderId}</p>
          <p><b>Amount:</b> ₹{transaction.amount}</p>
          <p><b>Payment ID:</b> {transaction.paymentId}</p>
          <p><b>Method:</b> {transaction.paymentMethod}</p>
          <p><b>Time:</b> {transaction.paymentTime}</p>
          {transaction.paymentMessage && <p><b>Message:</b> {transaction.paymentMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Wallet;
