// src/pages/astrologer/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { FaWallet, FaUserFriends, FaStar, FaCalendarAlt } from "react-icons/fa";

export default function AstrologerDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Astrologer Dashboard
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaWallet className="text-purple-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
            <p className="text-gray-600">₹ 5,200</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaUserFriends className="text-green-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Consultations</h2>
            <p className="text-gray-600">12 Active</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaStar className="text-yellow-500 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Rating</h2>
            <p className="text-gray-600">4.8 / 5</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4">
          <FaCalendarAlt className="text-blue-600 text-3xl" />
          <div>
            <h2 className="text-lg font-semibold">Availability</h2>
            <p className="text-gray-600">Online</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/astrologer/dashboard/profile"
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-xl shadow-md p-6 text-center"
        >
          Manage Profile
        </Link>

        <Link
          to="/astrologer/dashboard/wallet"
          className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-xl shadow-md p-6 text-center"
        >
          View Wallet
        </Link>

        <Link
          to="/astrologer/dashboard/consultations"
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-xl shadow-md p-6 text-center"
        >
          Consultations
        </Link>
      </div>
    </div>
  );
}
