import { useState } from "react";
import axios from "axios";

export default function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    birthTime: "",
    birthPlace: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      // ✅ Clear form after submit (success or error)
      setForm({
        name: "",
        email: "",
        password: "",
        dob: "",
        birthTime: "",
        birthPlace: "",
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

          {/* Birth Place */}
          <div>
            <label className="block text-gray-700 font-medium">
              Birth Place <span className="text-red-500">*</span>
            </label>
            <input
              name="birthPlace"
              value={form.birthPlace}
              placeholder="Enter birth place"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Redirect */}
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
