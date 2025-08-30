// MatchMakingForm.jsx
import { useState } from "react";
import axios from "axios";
import cityData from "../cities_sorted.json";

const API_KEY = process.env.REACT_APP_ASTRO_API_KEY;

const inputStyle = {
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box"
};
// Simple circular progress component
const CircularProgress = ({ score, out_of }) => {
  const percentage = (score / out_of) * 100;
  const strokeColor = percentage >= 75 ? "#4CAF50" : percentage >= 50 ? "#FF9800" : "#F44336";

  return (
    <svg width="120" height="120" viewBox="0 0 36 36">
      <path
        stroke="#f0f0f0"
        strokeWidth="4"
        fill="none"
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="20.35" fill="#333" fontSize="4" textAnchor="middle">{`${score}/${out_of}`}</text>
    </svg>
  );
};

export default function MatchMakingForm() {
  const [female, setFemale] = useState({ name: "", birthDate: "", hours: "", minutes: "", state: "", city: "", latitude: "", longitude: "", timezone: 5.5 });
  const [male, setMale] = useState({ name: "", birthDate: "", hours: "", minutes: "", state: "", city: "", latitude: "", longitude: "", timezone: 5.5 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

const states = [...new Set(cityData.map(c => c.state))].sort(); // alphabetically

  const getCitiesByState = (state) => cityData.filter(c => c.state === state);

  const handleChange = (e, person) => {
    const { name, value } = e.target;
    person === "female" ? setFemale({ ...female, [name]: value }) : setMale({ ...male, [name]: value });
  };

  const handleStateChange = (e, person) => {
    const state = e.target.value;
    const cities = getCitiesByState(state);
    const firstCity = cities[0];
    if (person === "female") setFemale({ ...female, state, city: firstCity?.city || "", latitude: firstCity?.latitude || "", longitude: firstCity?.longitude || "" });
    else setMale({ ...male, state, city: firstCity?.city || "", latitude: firstCity?.latitude || "", longitude: firstCity?.longitude || "" });
  };

  const handleCityChange = (e, person) => {
    const cityName = e.target.value;
    const city = cityData.find(c => c.city === cityName);
    if (!city) return;
    person === "female"
      ? setFemale({ ...female, city: city.city, latitude: city.latitude, longitude: city.longitude })
      : setMale({ ...male, city: city.city, latitude: city.latitude, longitude: city.longitude });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parseDate = (birthDate) => {
        const date = new Date(birthDate);
        return { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate() };
      };

      const fDate = parseDate(female.birthDate);
      const mDate = parseDate(male.birthDate);

      const body = {
        female: { ...female, year: fDate.year, month: fDate.month, date: fDate.date, hours: parseInt(female.hours), minutes: parseInt(female.minutes), seconds: 0, latitude: parseFloat(female.latitude), longitude: parseFloat(female.longitude) },
        male: { ...male, year: mDate.year, month: mDate.month, date: mDate.date, hours: parseInt(male.hours), minutes: parseInt(male.minutes), seconds: 0, latitude: parseFloat(male.latitude), longitude: parseFloat(male.longitude) },
        config: { observation_point: "topocentric", language: "en", ayanamsha: "lahiri" }
      };

      const res = await axios.post(
        "https://json.freeastrologyapi.com/match-making/ashtakoot-score",
        body,
        { headers: { "Content-Type": "application/json", "x-api-key": API_KEY } }
      );

      const output = typeof res.data.output === "string" ? JSON.parse(res.data.output) : res.data.output;
      setResult(output);
    } catch (err) {
      console.error(err);
      setResult({ error: "Error fetching matchmaking score." });
    }
    setLoading(false);
  };

  // Generate options for hours and minutes
  const hoursOptions = [...Array(24).keys()];
  const minutesOptions = [...Array(60).keys()];

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
<h2 style={{ textAlign: "center", marginBottom: "5px" }}>Kundli Matching Report</h2>
<p style={{ textAlign: "center", marginBottom: "25px", color: "#555", fontSize: "16px" }}>
  Find your right one through accurate matchmaking
</p>


      {/* Form Section */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
       {/* Female Card */}


<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
  {/* Male Card */}
  <div style={{ flex: 1, border: "1px solid #f0e68c", borderRadius: "8px", padding: "15px", background: "white" }}>
    <h3 style={{ textAlign: "center" }}>Male Details</h3>

    <div style={{ marginBottom: "10px" }}>
      <label>Name:</label><br />
      <input style={inputStyle} type="text" name="name" placeholder="Name" value={male.name} onChange={(e) => handleChange(e, "male")} required />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Date of Birth:</label><br />
      <input style={inputStyle} type="date" name="birthDate" value={male.birthDate} onChange={(e) => handleChange(e, "male")} required />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Time of Birth:</label><br />
      <input
        style={inputStyle}
        type="time"
        name="time"
        value={male.hours && male.minutes ? `${String(male.hours).padStart(2,'0')}:${String(male.minutes).padStart(2,'0')}` : ""}
        onChange={(e) => {
          const [h, m] = e.target.value.split(":");
          setMale({ ...male, hours: h, minutes: m });
        }}
        required
      />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>State:</label><br />
      <select style={inputStyle} value={male.state} onChange={(e) => handleStateChange(e, "male")} required>
        <option value="">Select State</option>
        {states.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    {male.state && (
      <div style={{ marginBottom: "10px" }}>
        <label>City:</label><br />
        <select style={inputStyle} value={male.city} onChange={(e) => handleCityChange(e, "male")} required>
          {getCitiesByState(male.state).map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
        </select>
      </div>
    )}
  </div>

  {/* Female Card */}
  <div style={{ flex: 1, border: "1px solid #f0e68c", borderRadius: "8px", padding: "15px", background: "white" }}>
    <h3 style={{ textAlign: "center" }}>Female Details</h3>

    <div style={{ marginBottom: "10px" }}>
      <label>Name:</label><br />
      <input style={inputStyle} type="text" name="name" placeholder="Name" value={female.name} onChange={(e) => handleChange(e, "female")} required />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Date of Birth:</label><br />
      <input style={inputStyle} type="date" name="birthDate" value={female.birthDate} onChange={(e) => handleChange(e, "female")} required />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>Time of Birth:</label><br />
      <input
        style={inputStyle}
        type="time"
        name="time"
        value={female.hours && female.minutes ? `${String(female.hours).padStart(2,'0')}:${String(female.minutes).padStart(2,'0')}` : ""}
        onChange={(e) => {
          const [h, m] = e.target.value.split(":");
          setFemale({ ...female, hours: h, minutes: m });
        }}
        required
      />
    </div>

    <div style={{ marginBottom: "10px" }}>
      <label>State:</label><br />
      <select style={inputStyle} value={female.state} onChange={(e) => handleStateChange(e, "female")} required>
        <option value="">Select State</option>
        {states.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    {female.state && (
      <div style={{ marginBottom: "10px" }}>
        <label>City:</label><br />
        <select style={inputStyle} value={female.city} onChange={(e) => handleCityChange(e, "female")} required>
          {getCitiesByState(female.state).map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
        </select>
      </div>
    )}
  </div>
</div>





        <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#FFD700", color: "#333", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px" }}>
          {loading ? "Checking..." : "Check Match"}
        </button>
      </form>

      {/* Result Section */}
      {result && !result.error && (
        <div style={{ marginTop: "30px", padding: "20px", borderRadius: "8px", background: "#fffbe6", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h3 style={{ textAlign: "center" }}>Summary of the Kundli Report</h3>

          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "20px", flexWrap: "wrap" }}>
            {/* Male Card */}
            <div style={{ border: "1px solid #f0e68c", borderRadius: "8px", padding: "15px", width: "250px", background: "#fffacd" }}>
              <h4 style={{ textAlign: "center" }}>Male</h4>
              <p><strong>Name:</strong> {male.name}</p>
              <p><strong>Birth Date & Time:</strong> {`${male.birthDate} | ${male.hours}:${male.minutes}`}</p>
              <p><strong>Birth Place:</strong> {`${male.city}, ${male.state}`}</p>
              <p><strong>Janam Rashi:</strong> {result?.varna_kootam?.groom?.moon_sign || "-"}</p>
            </div>

            {/* Female Card */}
            <div style={{ border: "1px solid #f0e68c", borderRadius: "8px", padding: "15px", width: "250px", background: "#fffacd" }}>
              <h4 style={{ textAlign: "center" }}>Female</h4>
              <p><strong>Name:</strong> {female.name}</p>
              <p><strong>Birth Date & Time:</strong> {`${female.birthDate} | ${female.hours}:${female.minutes}`}</p>
              <p><strong>Birth Place:</strong> {`${female.city}, ${female.state}`}</p>
              <p><strong>Janam Rashi:</strong> {result?.varna_kootam?.bride?.moon_sign || "-"}</p>
            </div>
          </div>

          {/* Guna Score */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h3>{result.total_score}/{result.out_of} is your <strong>Guna Score!</strong></h3>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
              <CircularProgress score={result.total_score} out_of={result.out_of} />
            </div>
            <p style={{ marginTop: "15px", fontSize: "16px" }}>
              {(() => {
                const percentage = (result.total_score / result.out_of) * 100;
                if (percentage >= 75) return "Excellent Match 🙂 Shaadi possible hai.";
                if (percentage >= 50) return "Good Match 🙂 Shaadi possible hai but astrologer se reconfirm kar lijiye.";
                return "Mismatch 🥺 Shaadi successful karne ke liye kuch upay karne padege. Astrologer se consult karein.";
              })()}
            </p>
          </div>

          {/* Kundli Details Table */}
          <div style={{ marginTop: "30px" }}>
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Kundli Details</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
              <thead>
                <tr style={{ background: "#f0e68c" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Attribute</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Male</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Female</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Received</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Out of</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result).map(([key, value]) => {
                  if (key === "total_score" || key === "out_of") return null;

                  let maleVal = "-";
                  let femaleVal = "-";
                  if (value.groom || value.bride) {
                    const groom = value.groom || value.male || value.groom_kootam || {};
                    const bride = value.bride || value.female || value.bride_kootam || {};

                    maleVal = groom.varnam_name || groom.groom_kootam_name || groom.star_name || groom.yoni || groom.moon_sign_lord_name || groom.groom_nadi_name || groom.moon_sign_name || groom.nadi_name || "-";
                    femaleVal = bride.varnam_name || bride.bride_kootam_name || bride.star_name || bride.yoni || bride.moon_sign_lord_name || bride.bride_nadi_name || bride.moon_sign_name || bride.nadi_name || "-";
                  }

                  return (
                    <tr key={key}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{key.replace("_", " ").toUpperCase()}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{maleVal}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{femaleVal}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{value.score || "-"}</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>{value.out_of || "-"}</td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: "bold", background: "#fffacd" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>TOTAL</td>
                  <td colSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>-</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.total_score}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{result.out_of}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}
   <div style={{ marginTop: "40px", padding: "20px", background: "#fffbe6", borderRadius: "8px", lineHeight: "1.6", color: "#333", fontSize: "14px" }}>
  <h3 style={{ textAlign: "center", marginBottom: "20px", fontSize: "16px" }}>
    Free Kundli Matching - Check Gun Milan & Marriage Compatibility
  </h3>
  <p style={{ marginBottom: "15px" }}>
    Many couples wonder whether professional kundli matching is necessary before tying the knot. With free online kundli matching tools, you can get an initial idea of your compatibility based on gun milan, without any cost.
  </p>
  <p style={{ marginBottom: "15px" }}>
    These free tools provide a basic overview of your compatibility, helping you understand your match better. For deeper insights or personalized guidance, consulting an experienced astrologer is recommended. Combining traditional kundli analysis with expert advice ensures the most accurate results.
  </p>
  <p style={{ marginBottom: "15px" }}>
    Thanks to online services, checking your kundli match has never been easier. You can view your gun milan and basic compatibility anytime, from the comfort of your home. Whether day or night, these tools make it convenient for busy couples to explore their patrika matching.
  </p>
</div>



    </div>
  );
}
