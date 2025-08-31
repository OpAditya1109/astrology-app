import React, { useState } from "react";
import axios from "axios";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const userId = "USER_12345"; // Replace with logged-in user ID

  // Create wallet recharge order
  const handleRecharge = async () => {
  if (!amount) return alert("Enter an amount");

  // Open a new tab immediately
  const newWindow = window.open('', '_blank');

  try {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/payment/recharge", {
      userId,
      amount: parseFloat(amount)
    });
console.log(res.data);

    setOrderId(res.data.orderId);
    setPaymentUrl(res.data.paymentUrl);

    // Set the new tab location
    if (newWindow) {
      newWindow.location.href = res.data.paymentUrl;
    } else {
      alert('Popup blocked! Please allow popups for this site.');
    }

  } catch (err) {
    console.error(err);
    alert("Failed to create wallet recharge");
    if (newWindow) newWindow.close();
  } finally {
    setLoading(false);
  }
};


  // Verify payment status
  const handleVerify = async () => {
    if (!orderId) return alert("No order ID to verify");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/payment/verify", { orderId });

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
        <button onClick={handleRecharge} disabled={loading || !amount} style={{ padding: "10px 20px", marginRight: 10 }}>
          {loading ? "Processing..." : "Recharge Wallet"}
        </button>

        {orderId && (
          <button onClick={handleVerify} disabled={loading} style={{ padding: "10px 20px" }}>
            Verify Payment
          </button>
        )}
      </div>

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
