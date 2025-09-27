// src/pages/astrologer/Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AstrologerDashboard() {
  const [astrologer, setAstrologer] = useState({
    rates: { chat: 0, video: 0, audio: 0 },
    online: { chat: false, video: false, audio: false },
  });
  const [totalTalkTime, setTotalTalkTime] = useState("00:00");

  const astrologerId = JSON.parse(sessionStorage.getItem("user"))?.id;

  // Fetch astrologer profile
  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/Consult-astrologers/${astrologerId}`
        );
        setAstrologer(res.data);
      } catch (err) {
        console.error("Failed to fetch astrologer data:", err);
      }
    };

    const fetchSession = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/Consult-astrologers/session/${astrologerId}`
        );
        setTotalTalkTime(res.data.totalTalkTime); // expect "MM:SS" or "HH:MM:SS"
      } catch (err) {
        console.error("Failed to fetch session data:", err);
      }
    };

    if (astrologerId) {
      fetchAstrologer();
      fetchSession();
    }
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
        `https://bhavanaastro.onrender.com/api/Consult-astrologers/update-rates-online/${astrologerId}`,
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

      {/* Total Talk Time */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg shadow-md">
        <p className="font-semibold text-lg">
          Total Talk Time:{" "}
          <span className="text-purple-700">{totalTalkTime}</span>
        </p>
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
          to="/astrologer/dashboard/consultations"
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-xl shadow-md p-6 text-center"
        >
          Consultations
        </Link>
      </div>
    </div>
  );
}
