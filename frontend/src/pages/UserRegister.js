import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cities from "../cities_minified.json"; // adjust path

export default function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    city: "",
    lat: null,
    lon: null,
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" }); 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCityChange = (e) => {
    const selectedCity = cities.find((c) => c.city === e.target.value);
    if (selectedCity) {
      setForm({
        ...form,
        birthPlace: selectedCity.city,
        city: selectedCity.city,
        lat: selectedCity.latitude,
        lon: selectedCity.longitude,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/users/register",
        form
      );

      // Success popup
      setPopup({ show: true, type: "success", message: "Registration Successful!" });
      setTimeout(() => {
        setPopup({ ...popup, show: false });
        navigate("/login"); // redirect after popup
      }, 2500);

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      setPopup({ show: true, type: "error", message: errorMessage }); // error popup
      setTimeout(() => setPopup({ ...popup, show: false }), 2500);
    } finally {
      setLoading(false);
      setForm({
        name: "",
        email: "",
        password: "",
        dob: "",
        birthTime: "",
        birthPlace: "",
        city: "",
        lat: null,
        lon: null,
        mobile: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-yellow-50 to-pink-100 p-6 relative">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              placeholder="Enter your name"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-gray-700 font-medium">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              placeholder="Enter your mobile number"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Birth Time */}
          <div>
            <label className="block text-gray-700 font-medium">
              Birth Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="birthTime"
              value={form.birthTime}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Birth Place Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">
              Birth Place <span className="text-red-500">*</span>
            </label>
            <select
              name="birthPlace"
              value={form.birthPlace}
              onChange={handleCityChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            >
              <option value="">Select your city</option>
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}, {c.state}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>

      {/* Centered popup with tick or error */}
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center ${
              popup.type === "success" ? "" : "border-2 border-red-500"
            }`}
          >
            {popup.type === "success" ? (
              <svg
                className="w-16 h-16 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <p
              className={`text-lg font-semibold ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
