import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

// Options (alphabetical order)
const systemsOptions = [
  { value: "Angel", label: "Angel Reading" },
  { value: "FaceReading", label: "Face Reading" },
  { value: "Horary", label: "Horary Astrology" },
  { value: "KP", label: "KP System" },
  { value: "LalKitab", label: "Lal Kitab" },
  { value: "Nadi", label: "Nadi Astrology" },
  { value: "Numerology", label: "Numerology" },
  { value: "Palmistry", label: "Palmistry" },
  { value: "Prashna", label: "Prashna Kundali" },
  { value: "Psychic", label: "Psychic Reading" },
  { value: "Tarot", label: "Tarot Reading" },
  { value: "Vastu", label: "Vastu Shastra" },
  { value: "Vedic", label: "Vedic Astrology" },
  { value: "Western", label: "Western Astrology" },
];

const languageOptions = [
  { value: "Assamese", label: "Assamese" },
  { value: "Bengali", label: "Bengali" },
  { value: "Bhojpuri", label: "Bhojpuri" },
  { value: "English", label: "English" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Hindi", label: "Hindi" },
  { value: "Kannada", label: "Kannada" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Marathi", label: "Marathi" },
  { value: "Oriya", label: "Oriya" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Sanskrit", label: "Sanskrit" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
  { value: "Urdu", label: "Urdu" },
];

const categoryOptions = [
  { value: "Business", label: "Business" },
  { value: "Career", label: "Career" },
  { value: "Education", label: "Education" },
  { value: "Finance", label: "Finance" },
  { value: "Health", label: "Health" },
  { value: "Legal", label: "Legal" },
  { value: "Love", label: "Love" },
  { value: "Marriage", label: "Marriage" },
  { value: "Pregnancy", label: "Pregnancy" },
];

const AstrologerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    mobile: "",
    experience: "",
    city: "",
    country: "",
    systemsKnown: [],
    languagesKnown: [],
    categories: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selected, field) => {
    setForm({ ...form, [field]: selected || [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://bhavanaastro.onrender.com/api/astrologers/register", {
        ...form,
        systemsKnown: form.systemsKnown.map((s) => s.value),
        languagesKnown: form.languagesKnown.map((l) => l.value),
        categories: form.categories.map((c) => c.value),
      });
      alert(res.data.message || "Registration successful");
    } catch (err) {
      alert(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl border border-orange-200">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          🔮 Astrologer Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-semibold">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              required
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Mobile & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                required
                value={form.mobile}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                Experience (years) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experience"
                required
                value={form.experience}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                required
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          {/* Systems Known */}
          <div>
            <label className="block mb-1 font-semibold">
              Systems Known <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={systemsOptions}
              value={form.systemsKnown}
              onChange={(selected) => handleMultiSelectChange(selected, "systemsKnown")}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block mb-1 font-semibold">
              Languages Known <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={languageOptions}
              value={form.languagesKnown}
              onChange={(selected) => handleMultiSelectChange(selected, "languagesKnown")}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block mb-1 font-semibold">
              Categories <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              options={categoryOptions}
              value={form.categories}
              onChange={(selected) => handleMultiSelectChange(selected, "categories")}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition"
          >
            Register
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-orange-600 font-semibold hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AstrologerRegister;
