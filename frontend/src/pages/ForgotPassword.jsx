import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/auth/forgot-password",
        { email }
      );
      setPopupMessage(res.data.message);
      setShowPopup(true);
      setDisabled(true); // disable after one click
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Something went wrong");
      setShowPopup(true);
    }

    setLoading(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/login"); // redirect to login after popup close
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        <label className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none mb-4"
        />

        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="text-gray-700 mb-4">{popupMessage}</p>
            <button
              onClick={handleClosePopup}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
