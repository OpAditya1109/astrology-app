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

    let svgData = res.data.svg;

    // Remove ALL width/height attributes so CSS can control size
    svgData = svgData.replace(/(width|height)="[^"]*"/g, "");

    // Add responsive style to <svg>
    svgData = svgData.replace(
      /<svg([^>]*)>/,
      '<svg$1 style="width:100%; height:auto; max-width:600px; display:block; margin:auto;">'
    );

    // Increase all font-sizes inside SVG
    // svgData = svgData.replace(/font-size:\s*([\d.]+)px/gi, (match, p1) => {
    //   const newSize = Math.round(parseFloat(p1) * 1.8); // increase ~80%
    //   return `font-size:${newSize}px`;
    // });

    setKundaliSvg(svgData);
  } catch (err) {
    console.error("Error fetching kundali:", err);
    setError("❌ Failed to generate Kundali. Please check your details.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-2xl mt-4 sm:mt-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-indigo-700">
        🪔 Free Kundali Generator
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            className="w-full border rounded-lg p-3 text-sm sm:text-base"
            onChange={handleChange}
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Time of Birth
          </label>
          <input
            type="time"
            name="tob"
            className="w-full border rounded-lg p-3 text-sm sm:text-base"
            onChange={handleChange}
            required
          />
        </div>

        {/* ✅ Searchable City Dropdown */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            City of Birth
          </label>
          <Select
            options={cityOptions}
            onChange={handleCityChange}
            placeholder="Search for your city..."
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                padding: "4px",
                fontSize: "14px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
        </div>

        {/* Language */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Language
          </label>
          <select
            name="lang"
            value={form.lang}
            className="w-full border rounded-lg p-3 text-sm sm:text-base"
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? "⚡ Generating..." : "Generate Kundali"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-center text-sm sm:text-base">{error}</p>}

{kundaliSvg && (
  <div className="mt-6 sm:mt-8 p-3 sm:p-4 border rounded-lg shadow-md bg-gray-50">
    <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
      📜 Your Kundali
    </h3>
    <div
      className="w-full flex justify-center"
      dangerouslySetInnerHTML={{ __html: kundaliSvg }}
    />
  </div>
)}



    </div>
  );
};

export default FreeKundali;
