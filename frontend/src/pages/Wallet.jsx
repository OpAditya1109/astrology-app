import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  // ✅ Parse user AFTER hooks
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || user?.id;
  const { name, email, mobile } = user || {};

  // ✅ Fetch wallet balance (only if logged in)
  useEffect(() => {
    if (!userId) return; // don't fetch if not logged in

    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/users/${userId}`
        );
        setBalance(res.data.wallet?.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    fetchBalance();
  }, [userId]);

  // ✅ Create wallet recharge order
  const handleRecharge = async () => {
    if (!amount) return alert("Enter an amount");
    if (!userId) return alert("User not logged in!");
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/wallet/topup",
        {
          userId,
          amount: parseFloat(amount),
          phone: mobile,
          name,
          email,
        }
      );

      const { orderId, paymentSessionId } = res.data;

      if (!paymentSessionId) {
        setError("Payment session not received from server");
        return;
      }

      setOrderId(orderId);

      const cashfree = await load({ mode: "production" });
      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Failed to create wallet recharge:", err);
      setError("Failed to initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify payment
  const handleVerify = async () => {
    if (!orderId) return alert("No order ID to verify");

    try {
      setLoading(true);
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/wallet/verify",
        { orderId }
      );
      setStatus(res.data.orderStatus);
      setTransaction(res.data.transaction);

      // refresh balance
      const userRes = await axios.get(
        `https://bhavanaastro.onrender.com/api/users/${userId}`
      );
      setBalance(userRes.data.wallet?.balance || 0);
    } catch (err) {
      console.error(err);
      alert("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  // ✅ If not logged in, show message instead of returning early
  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Please log in to use wallet</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h2>Wallet Recharge</h2>

      <h3 style={{ marginBottom: "20px" }}>
        Current Balance: ₹{balance}
      </h3>

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
          <button
            onClick={handleVerify}
            disabled={loading}
            style={{ padding: "10px 20px" }}
          >
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
          {transaction.paymentMessage && (
            <p><b>Message:</b> {transaction.paymentMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
