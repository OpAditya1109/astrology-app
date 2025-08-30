import { useState, useEffect } from "react";
import axios from "axios";

export default function Wallet() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null);

  // ✅ Load Cashfree SDK dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js"; // use prod
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        setCashfree(new window.Cashfree({ mode: "production" }));
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddFunds = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      // Step 1: Call backend to create order
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/payment/create-order",
        { amount: value, userId: "12345" }, // replace with logged-in userId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = res.data.sessionId;
      if (!sessionId) {
        alert("Failed to get payment session ID");
        return;
      }

      // Step 2: Call Cashfree checkout
      if (!cashfree) {
        alert("Cashfree SDK not loaded yet, try again.");
        return;
      }

      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self", // open in same tab
      });
    } catch (err) {
      console.error("Error starting payment", err);
      alert("Something went wrong, try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Add Money</h2>

        {/* Input Box */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full mb-4 outline-none"
          disabled={loading}
        />

        {/* Add Money Button */}
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
