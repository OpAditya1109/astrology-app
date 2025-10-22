import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state || { title: "Consultation", price: 0 };

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id || user?.id;
  const { name, email, mobile } = user || {};

  const handleCashfreePayment = async () => {
    if (!userId) return alert("User not logged in!");
    setError("");
    setLoading(true);

    try {
      // Create order on backend
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/wallet/topup",
        {
          userId,
       amount: Number(service.price),

          phone: mobile,
          name,
          email,
        //   service: service.title,
        }
      );

      const { orderId, paymentSessionId } = res.data;
      if (!paymentSessionId) throw new Error("Payment session not received");

      setOrderId(orderId);

      const cashfree = await load({ mode: "production" });
      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    if (!user) {
      alert("Please log in first!");
      return;
    }

    if (paymentMethod === "Cashfree") {
      await handleCashfreePayment();
    } else if (paymentMethod === "Crypto") {
      alert("Crypto payment flow coming soon!");
      // Here you can redirect to crypto payment or your crypto API
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 flex flex-col items-center py-16 px-4">
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

          {/* Payment Options */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Select Payment Method
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("Cashfree")}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
                  paymentMethod === "Cashfree"
                    ? "bg-green-800 shadow-lg"
                    : "bg-black hover:bg-yellow-600"
                }`}
              >
                Cashfree
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Crypto")}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${
                  paymentMethod === "Crypto"
                    ? "bg-green-800 shadow-lg"
                    : "bg-black hover:bg-green-600"
                }`}
              >
                Crypto
              </button>
            </div>
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
