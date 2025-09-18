import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, token, role } = useAuth(); // ✅ get token & role too

  // 🚀 Redirect if already logged in
  useEffect(() => {
    if (token && role) {
      if (role === "user") navigate("/user/dashboard");
      else if (role === "astrologer") navigate("/astrologer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    }
  }, [token, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://bhavanaastro.onrender.com/api/auth/login",
        { email, password }
      );

      login({
        token: data.token,
        role: data.user.role,
        userId: data.user.id,
      });

      // redirect by role
      if (data.user.role === "user") navigate("/user/dashboard");
      else if (data.user.role === "astrologer") navigate("/astrologer/dashboard");
      else if (data.user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium">Email *</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-medium">Password *</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full text-white py-2 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
