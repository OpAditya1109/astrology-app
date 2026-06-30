import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state || { title: "Consultation", price: 0 };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || user?.id;
  const { name, email, mobile } = user || {};

  // ---------- RAZORPAY PAYMENT FLOW ----------
  const openRazorpayCheckout = useCallback(
    ({ razorpayOrderId, keyId, amount, currency, internalOrderId }) => {
      const options = {
        key: keyId,
        amount,
        currency: currency || "INR",
        name: "AstroBhavana",
        description: service.title,
        order_id: razorpayOrderId,
        prefill: {
          name: name || "",
          email: email || "",
          contact: mobile || "",
        },
        theme: { color: "#ca8a04" }, // yellow to match the page theme
        handler: async function (response) {
          try {
            setLoading(true);
            await axios.post(
              "https://bhavanaastro.onrender.com/api/wallet/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: internalOrderId,
              }
            );
            navigate("/wallet-success?order_id=" + internalOrderId);
          } catch (err) {
            console.error(err);
            setError("Payment succeeded but verification failed. Contact support.");
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
        setLoading(false);
      });
      rzp.open();
    },
    [name, email, mobile, service.title, navigate]
  );

  const handleRazorpayPayment = async () => {
    if (!userId) return alert("User not logged in!");
    setError("");
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/wallet/topup",
        {
          userId,
          amount: Number(service.price),
          phone: mobile,
          name,
          email,
        }
      );

      const { orderId: internalOrderId, razorpayOrderId, keyId, amount, currency } = res.data;
      if (!razorpayOrderId) throw new Error("Payment order not received");

      openRazorpayCheckout({ razorpayOrderId, keyId, amount, currency, internalOrderId });
    } catch (err) {
      console.error(err);
      setError("Failed to initiate Razorpay payment. Try again.");
      setLoading(false);
    }
  };

  // ---------- HANDLE FORM SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in first!");
      return;
    }

    await handleRazorpayPayment();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 flex flex-col items-center py-16 px-4">
      {/* ---------- Spinner Overlay ---------- */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-yellow-200 p-10">
        <h1 className="text-4xl font-extrabold text-yellow-700 mb-6 text-center drop-shadow-md">
          Checkout — {service.title}
        </h1>

        <p className="text-gray-700 text-center mb-8 text-lg">
          Final Amount:{" "}
          <span className="font-semibold text-yellow-600 text-2xl">
            ₹{service.price.toLocaleString("en-IN")}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              required
              defaultValue={name || ""}
              className="peer w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all duration-300 peer-focus:top-1 peer-focus:text-yellow-700 peer-focus:text-sm">
              Full Name
            </label>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <input
              type="tel"
              required
              defaultValue={mobile || ""}
              className="peer w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all duration-300 peer-focus:top-1 peer-focus:text-yellow-700 peer-focus:text-sm">
              Phone Number
            </label>
          </div>

          {/* Birth Date */}
          <div className="relative">
            <input
              type="date"
              required
              className="peer w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2 text-yellow-600 text-sm bg-white px-1">
              Birth Date
            </label>
          </div>

          {/* Birth Time */}
          <div className="relative">
            <input
              type="time"
              required
              className="peer w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 -top-2 text-yellow-600 text-sm bg-white px-1">
              Birth Time
            </label>
          </div>

          {/* Place of Birth */}
          <div className="relative">
            <input
              type="text"
              required
              className="peer w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition outline-none"
              placeholder=" "
            />
            <label className="absolute left-4 top-4 text-gray-400 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base transition-all duration-300 peer-focus:top-1 peer-focus:text-yellow-700 peer-focus:text-sm">
              Place of Birth
            </label>
          </div>


          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-yellow-300 transition transform hover:-translate-y-1 mt-6 disabled:opacity-50"
          >
            {loading ? "Processing Payment..." : "Confirm & Proceed to Pay"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 italic text-sm">
          All bookings are confidential. Ensure your details are accurate for the astrologer to provide precise guidance.
        </p>
      </div>
    </div>
  );
}