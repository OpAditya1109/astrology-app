import { useState } from "react";
import axios from "axios";
import cities from "../data/cities_sorted.json"; // adjust path

export default function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
    city: "",   // city name
    lat: null,  // latitude
    lon: null,  // longitude
    mobile: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // When a city is selected from dropdown
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
    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/users/register",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-yellow-50 to-pink-100 p-6">
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
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-medium hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
