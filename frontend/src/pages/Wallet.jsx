import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Wallet as WalletIcon, PlusCircle } from "lucide-react";

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [resultType, setResultType] = useState(null); // "success" | "failed"

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

  // Open Razorpay checkout
  const openRazorpayCheckout = useCallback(
    ({ razorpayOrderId, keyId, amount: rzpAmount, currency, internalOrderId }) => {
      const options = {
        key: keyId,
        amount: rzpAmount, // already in paise from backend
        currency: currency || "INR",
        name: "AstroBhavana Wallet",
        description: "Wallet Recharge",
        order_id: razorpayOrderId,
        prefill: {
          name: name || "",
          email: email || "",
          contact: mobile || "",
        },
        theme: { color: "#16a34a" },
        handler: async function (response) {
          // Payment success — verify signature on backend
          try {
            setLoading(true);
            const res = await axios.post(
              "https://bhavanaastro.onrender.com/api/wallet/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: internalOrderId,
              }
            );
            setStatus(res.data.orderStatus);
            setTransaction(res.data.transaction);

            const isPaid =
              (res.data.orderStatus || "").toLowerCase() === "paid" ||
              (res.data.orderStatus || "").toLowerCase() === "captured";
            setResultType(isPaid ? "success" : "failed");
            setShowResultPopup(true);

            // Refresh balance
            const userRes = await axios.get(
              `https://bhavanaastro.onrender.com/api/users/${userId}/details`
            );
            setBalance(userRes.data.wallet?.balance || 0);
          } catch (err) {
            console.error(err);
            setError("Payment succeeded but verification failed. Contact support.");
            setResultType("failed");
            setShowResultPopup(true);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setResultType("failed");
        setShowResultPopup(true);
        setLoading(false);
      });
      rzp.open();
    },
    [name, email, mobile, userId]
  );

  // Razorpay recharge
  const handleRecharge = async () => {
    if (!amount) return alert("Enter an amount");
    if (!userId) return alert("User not logged in!");
    setError("");

    try {
      setLoading(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay. Check your internet connection.");
        setLoading(false);
        return;
      }

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

      const { orderId: internalOrderId, razorpayOrderId, keyId, amount: rzpAmount, currency } = res.data;
      if (!razorpayOrderId) {
        setError("Payment order not received from server");
        setLoading(false);
        return;
      }

      openRazorpayCheckout({ razorpayOrderId, keyId, amount: rzpAmount, currency, internalOrderId });
    } catch (err) {
      console.error("Failed to create wallet recharge:", err);
      setError("Failed to initiate payment. Try again.");
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

        {/* Input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Payment Button */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleRecharge}
            disabled={loading || !amount}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add via Razorpay"}
          </button>
        </div>

        {/* Quick Select Amounts */}
        <div className="flex flex-wrap gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`px-4 py-2 rounded-lg border ${
                amount === String(amt) || Number(amount) === amt
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white hover:bg-green-50 border-gray-300"
              } transition`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && !showResultPopup && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {/* Payment Result Popup */}
      {showResultPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in duration-200">
            {resultType === "success" ? (
              <>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Payment Successful
                </h3>
                <p className="text-gray-500 mb-1">
                  ₹{transaction?.amount || amount} added to your wallet
                </p>
                <p className="text-gray-400 text-sm">
                  New balance: ₹{balance}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-9 h-9 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Payment Failed
                </h3>
                <p className="text-gray-500">
                  We couldn't complete your payment. Please try again.
                </p>
              </>
            )}

            <button
              onClick={() => {
                setShowResultPopup(false);
                setError("");
              }}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;