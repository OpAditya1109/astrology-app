import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import cities from "../cities_minified.json";
// Options
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
  const navigate = useNavigate();
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
  description: "",   // ✅ added description
});

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (selected, field) => {
    setForm({ ...form, [field]: selected || [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (Array.isArray(form[key])) {
          form[key].forEach((item) => formData.append(key, item.value));
        } else {
          formData.append(key, form[key]);
        }
      });

      if (photo) formData.append("photo", photo);

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/astrologers/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPopup({ show: true, type: "success", message: res.data.message || "Registration Successful!" });

      // Reset form
      setForm({
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
      setPhoto(null);

      setTimeout(() => {
        setPopup({ ...popup, show: false });
        navigate("/Thankyou"); // redirect after popup
      }, 2500);

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      setPopup({ show: true, type: "error", message: errorMessage });
      setTimeout(() => setPopup({ ...popup, show: false }), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-6 relative">
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
  <select
    name="city"
    value={form.city}
    onChange={(e) => {
      const selectedCity = cities.find((c) => c.city === e.target.value);
      if (selectedCity) {
        setForm({
          ...form,
          city: selectedCity.city,
          country: selectedCity.country || "India", // optional
        });
      }
    }}
    className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
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
                disabled={loading}
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
              isDisabled={loading}
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
              isDisabled={loading}
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
              isDisabled={loading}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          {/* Description */}
<div>
  <label className="block mb-1 font-semibold">
    About / Description <span className="text-red-500">*</span>
  </label>
  <textarea
    name="description"
    required
    value={form.description}
    onChange={handleChange}
    disabled={loading}
    rows="4"
    placeholder="Write about your experience, expertise, or introduction..."
    className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
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
              disabled={loading}
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
              disabled={loading}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block mb-1 font-semibold">
              Profile Photo <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              disabled={loading}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
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

      {/* Centered popup */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className={`text-lg font-semibold ${popup.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {popup.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologerRegister;
