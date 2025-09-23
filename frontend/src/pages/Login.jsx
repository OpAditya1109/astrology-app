import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const storedUser =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));

    if (storedUser?.role) {
      redirectByRole(storedUser.role);
    }
  }, [navigate]);

  const redirectByRole = (role) => {
    if (role === "user") navigate("/user/dashboard");
    else if (role === "astrologer") navigate("/astrologer/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://bhavanaastro.onrender.com/api/auth/login",
        { email, password }
      );

      // Save user + token in sessionStorage & localStorage
      const userData = {
        token: data.token,
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        mobile: data.user.mobile,
        role: data.user.role,
        birthTime: data.user.birthTime,
        birthPlace: data.user.birthPlace,
        dob: data.user.dob,
        kundaliUrl: data.user.kundaliUrl,
      };

      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      redirectByRole(userData.role);
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
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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

        {/* Links Section */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm">
            New account?{" "}
            <Link
              to="/user/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="text-sm">
            <Link
              to="/forgot-password"
              className="text-gray-600 hover:text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
