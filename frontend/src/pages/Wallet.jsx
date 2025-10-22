import React, { useState, useEffect } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { Wallet as WalletIcon, PlusCircle, RefreshCw, Bitcoin } from "lucide-react";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || user?.id;
  const { name, email, mobile } = user || {};

  useEffect(() => {
    if (!userId) return;

    const fetchBalance = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/users/${userId}/details`
        );
        setBalance(res.data.wallet?.balance || 0);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    fetchBalance();
  }, [userId]);

  // 🪙 Cashfree recharge (INR)
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

  // 🧾 Verify payment (Cashfree)
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

      const userRes = await axios.get(
        `https://bhavanaastro.onrender.com/api/users/${userId}/details`
      );
      setBalance(userRes.data.wallet?.balance || 0);
    } catch (err) {
      console.error(err);
      alert("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  // 🪙 Crypto payment using NOWPayments
// 🪙 Crypto payment using NOWPayments
const handleCryptoRecharge = async () => {
  if (!amount) return alert("Enter an amount");
  if (!userId) return alert("User not logged in!");
  setError("");

  try {
    setLoading(true);

    const res = await axios.post(
      "https://bhavanaastro.onrender.com/api/cryptopayment/create",
      {
        orderId: `crypto-${Date.now()}-${userId}`,
        amount: parseFloat(amount),
        priceCurrency: "USD", // NOWPayments mainly supports USD, EUR, etc.
        payCurrency: "SHIB", // ✅ Default to Shiba Inu
      }
    );

    if (res.data.success && res.data.paymentUrl) {
      // Redirect user to NOWPayments checkout
      window.location.href = res.data.paymentUrl;
    } else {
      setError("Failed to generate crypto payment link");
    }
  } catch (err) {
    console.error("Crypto Payment Error:", err);
    setError("Failed to initiate crypto payment");
  } finally {
    setLoading(false);
  }
};


  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600">
          Please log in to use wallet
        </h2>
      </div>
    );
  }

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl p-6 shadow-lg mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">My Wallet</h2>
          <p className="text-3xl font-bold mt-2">₹{balance}</p>
        </div>
        <WalletIcon size={40} className="opacity-80" />
      </div>

      {/* Add Funds Section */}
      <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <PlusCircle className="text-green-600" size={20} />
          Add Funds
        </h3>

        {/* Input + Button */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Payment Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleRecharge}
            disabled={loading || !amount}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add via Cashfree"}
          </button>

          <button
            onClick={handleCryptoRecharge}
            disabled={loading || !amount}
            className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2 px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            <Bitcoin size={18} />
            {loading ? "Processing..." : "Pay with Crypto"}
          </button>
        </div>

        {/* Quick Select Amounts */}
        <div className="flex flex-wrap gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`px-4 py-2 rounded-lg border ${
                amount == amt
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white hover:bg-green-50 border-gray-300"
              } transition`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Verify Payment */}
      {orderId && (
        <div className="text-center mt-5">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 justify-center text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50 mx-auto"
          >
            <RefreshCw size={18} />
            Verify Payment
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      {/* Transaction Status */}
      {status && transaction && (
        <div className="mt-8 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Transaction Details
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <b>Status:</b> {status}
            </p>
            <p>
              <b>Order ID:</b> {transaction.orderId}
            </p>
            <p>
              <b>Amount:</b> ₹{transaction.amount}
            </p>
            <p>
              <b>Payment ID:</b> {transaction.paymentId}
            </p>
            <p>
              <b>Method:</b> {transaction.paymentMethod}
            </p>
            <p>
              <b>Time:</b> {transaction.paymentTime}
            </p>
            {transaction.paymentMessage && (
              <p>
                <b>Message:</b> {transaction.paymentMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
