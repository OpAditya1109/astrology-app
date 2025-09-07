import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DailyHoroscopes() {
  const [horoscopes, setHoroscopes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoroscopes = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/horoscope/all");

        const horoArray = Object.keys(data).map((sign) => ({
          sign,
          horoscope:
            data[sign]?.data?.horoscope_data || JSON.stringify(data[sign]),
        }));

        setHoroscopes(horoArray);
      } catch (err) {
        setError("Failed to fetch horoscopes");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscopes();
  }, []);

  if (loading) return <p className="text-center mt-6 text-gray-500">Loading horoscopes...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">🌟 Daily Horoscopes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {horoscopes.map(({ sign, horoscope }) => (
          <div
            key={sign}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <h3 className="text-xl font-bold text-purple-700 mb-3 text-center">{sign}</h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{horoscope}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
