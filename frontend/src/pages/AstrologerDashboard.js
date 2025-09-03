// src/pages/astrologer/Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWallet, FaUserFriends, FaStar, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

export default function AstrologerDashboard() {
  const [astrologer, setAstrologer] = useState({
    rates: { chat: 0, video: 0, audio: 0 },
    online: { chat: false, video: false, audio: false },
  });

  const astrologerId = JSON.parse(sessionStorage.getItem("user"))?.id;

  // Fetch astrologer data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/astrologers/${astrologerId}`
        );
        setAstrologer(res.data);
      } catch (err) {
        console.error("Failed to fetch astrologer data:", err);
      }
    };
    fetchData();
  }, [astrologerId]);

  // Toggle online status
  const handleToggle = (mode) => {
    setAstrologer((prev) => ({
      ...prev,
      online: { ...prev.online, [mode]: !prev.online[mode] },
    }));
  };

  // Update rates
  const handleRateChange = (mode, value) => {
    setAstrologer((prev) => ({
      ...prev,
      rates: { ...prev.rates, [mode]: Number(value) },
    }));
  };

  // Save settings to DB
  const saveSettings = async () => {
    try {
      await axios.put(
        `https://bhavanaastro.onrender.com/api/astrologers/update-rates-online/${astrologerId}`,
        { rates: astrologer.rates, online: astrologer.online }
      );
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Astrologer Dashboard
      </h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
            <p className="text-gray-600">
              {astrologer.online.chat || astrologer.online.video || astrologer.online.audio
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Consultation Settings */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Consultation Settings</h2>

        {["chat", "video", "audio"].map((mode) => (
          <div key={mode} className="flex items-center gap-4 mb-4">
            <label className="capitalize w-24">{mode} Online:</label>
            <input
              type="checkbox"
              checked={astrologer.online[mode]}
              onChange={() => handleToggle(mode)}
              className="w-5 h-5"
            />
            <label className="ml-4">Rate (₹):</label>
            <input
              type="number"
              value={astrologer.rates[mode]}
              onChange={(e) => handleRateChange(mode, e.target.value)}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
        ))}

        <button
          onClick={saveSettings}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Save Settings
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
