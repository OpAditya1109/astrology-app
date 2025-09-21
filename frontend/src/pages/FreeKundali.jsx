import { useState } from "react";
import axios from "axios";
import cities from "../cities_minified.json"; // ✅ your city list
import Select from "react-select"; // ✅ import react-select

const FreeKundali = () => {
  const [form, setForm] = useState({
    dob: "",
    tob: "",
    lat: "",
    lon: "",
    lang: "en",
  });
  const [kundaliSvg, setKundaliSvg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Map cities into react-select format
  const cityOptions = cities.map((c) => ({
    value: c.city,
    label: `${c.city}, ${c.state}`,
    lat: c.latitude,
    lon: c.longitude,
  }));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (selectedOption) => {
    if (selectedOption) {
      setForm({
        ...form,
        lat: selectedOption.lat,
        lon: selectedOption.lon,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setKundaliSvg(null);

    try {
      const res = await axios.post("https://bhavanaastro.onrender.com/api/free-kundali", form);
      setKundaliSvg(res.data.svg);
    } catch (err) {
      console.error("Error fetching kundali:", err);
      setError("❌ Failed to generate Kundali. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
        🪔 Free Kundali Generator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            className="w-full border rounded-lg p-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block font-medium mb-1">Time of Birth</label>
          <input
            type="time"
            name="tob"
            className="w-full border rounded-lg p-2"
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Searchable City Dropdown */}
        <div>
          <label className="block font-medium mb-1">City of Birth</label>
          <Select
            options={cityOptions}
            onChange={handleCityChange}
            placeholder="Search for your city..."
            isSearchable
          />
        </div>

        {/* Language */}
        <div>
          <label className="block font-medium mb-1">Language</label>
          <select
            name="lang"
            value={form.lang}
            className="w-full border rounded-lg p-2"
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "⚡ Generating..." : "Generate Kundali"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {kundaliSvg && (
        <div className="mt-8 p-4 border rounded-lg shadow-md bg-gray-50">
          <h3 className="text-lg font-semibold text-center mb-4">
            📜 Your Kundali
          </h3>
          <div
            className="flex justify-center overflow-auto"
            dangerouslySetInnerHTML={{ __html: kundaliSvg }}
          />
        </div>
      )}
    </div>
  );
};

export default FreeKundali;
