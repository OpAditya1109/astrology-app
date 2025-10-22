import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state || { title: "Consultation", price: 0 };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your consultation has been booked successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-white flex flex-col items-center py-16 px-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 border border-yellow-100">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6 text-center">
          Checkout — {service.title}
        </h1>

        <p className="text-gray-700 text-center mb-6 text-lg">
          Final Amount: <span className="font-semibold text-yellow-700">₹{service.price.toLocaleString("en-IN")}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Birth Date & Time</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. 12 Jan 1990, 10:45 AM"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Place of Birth</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your birth place"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold text-lg transition"
          >
            Confirm & Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  );
}
