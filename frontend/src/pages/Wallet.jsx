// Wallet.jsx
import { useState } from "react";
import axios from "axios";

export default function Wallet() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Call backend to create Cashfree order
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/payment/create-order",
        { amount: value, userId: "12345" } // Replace with actual logged-in userId
      );

      // Step 2: Get the payment URL from backend
      const paymentsUrl = res.data.paymentsUrl || res.data.paymentUrl || res.data.raw?.payments?.url;

      if (!paymentsUrl) {
        alert("Failed to get payment URL");
        return;
      }

      // Step 3: Redirect user to Cashfree checkout page
      window.location.href = paymentsUrl;

    } catch (err) {
      console.error("❌ Error starting payment:", err);
      alert("Something went wrong, try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Add Money</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-4 outline-none"
          disabled={loading}
        />

        <button
          onClick={handleAddFunds}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 w-full"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Money"}
        </button>
      </div>
    </div>
  );
}
