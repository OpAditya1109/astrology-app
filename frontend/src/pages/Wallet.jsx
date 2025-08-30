import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const presetAmounts = [200, 500, 1000, 2000, 3000, 4000, 8000, 15000];

  // Fetch wallet balance on page load
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = sessionStorage.getItem("token"); // adjust if using localStorage
        const res = await axios.get("/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };
    fetchBalance();
  }, []);

  // Handle Add Funds
  const handleAddFunds = async (amt) => {
    const value = amt || Number(amount);
    if (!value || value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      // 👉 Step 1: Create payment session on backend
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "/api/wallet/create-payment",
        { amount: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 👉 Step 2: Redirect user to UPI/payment gateway
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      console.error("Error starting payment", err);
      alert("Something went wrong, try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-700">Astro Bhavana</h1>
          <div className="flex items-center gap-6">
            <Link
              to="/user/dashboard"
              className="text-gray-700 hover:text-purple-700 font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/logout"
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="pt-20"></div>

      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6">My Wallet</h2>
        <p className="text-gray-600 mb-8">
          Check your balance, add funds, or redeem your wallet credits.
        </p>

        {/* Wallet Balance */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center mb-8">
          <h3 className="text-xl font-bold text-purple-700 mb-2">
            Current Balance
          </h3>
          <p className="text-gray-700 text-2xl font-semibold">₹{balance}</p>
        </div>

        {/* Add Funds */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Add Funds</h3>

          {/* Preset Amount Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleAddFunds(amt)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                disabled={loading}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <input
            type="number"
            placeholder="Enter custom amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full mb-4 outline-none"
            disabled={loading}
          />
          <button
            onClick={() => handleAddFunds()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Money"}
          </button>
        </div>
      </section>

      <footer className="bg-white border-t py-6 mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} AstroBhavana. All rights reserved.
      </footer>
    </div>
  );
}
