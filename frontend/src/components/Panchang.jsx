import React, { useEffect, useState } from "react";
import axios from "axios";

const Panchang = () => {
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        const now = new Date();
        const payload = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
          latitude: 28.6139,  // Delhi (change to user location if needed)
          longitude: 77.2090,
          timezone: 5.5
        };

        const res = await axios.post("https://bhavanaastro.onrender.com/api/panchang", payload);
        setPanchang(res.data.data);
      } catch (err) {
        console.error("Error fetching Panchang:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchang();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading Panchang...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">📿 Today’s Panchang</h2>
      {panchang ? (
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(panchang).map(([key, value], idx) => (
            <div key={idx} className="p-4 border rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg capitalize">{key.replace("-", " ")}</h3>
              <pre className="text-sm mt-2 bg-gray-50 p-2 rounded">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No Panchang data available</p>
      )}
    </div>
  );
};

export default Panchang;
