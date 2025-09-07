import React, { useEffect, useState } from "react";
import axios from "axios";

function BorderedText({ text }) {
  return (
    <span className="inline-flex items-center border px-3 py-[3px] rounded text-sm font-semibold bg-gray-50 whitespace-nowrap">
      {text}
    </span>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between text-base px-3 py-3 border-b gap-2">
      <span className="font-semibold">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}


export default function Panchang() {
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const currentDate = `${dd}/${mm}/${yyyy}`;
        const currentTime = `${hours}:${minutes}`;

        const { data } = await axios.post("http://localhost:5000/api/panchang", {
          date: currentDate,
          lat: "18.9582",
          lon: "72.8321",
          tz: 5.5,
          time: currentTime,
          lang: "en",
        });

        setPanchang(data);
      } catch (err) {
        setError("Failed to fetch Panchang");
      } finally {
        setLoading(false);
      }
    };

    fetchPanchang();
  }, []);

  if (loading)
    return <p className="text-center mt-2 text-gray-500 text-sm">Loading...</p>;
  if (error)
    return <p className="text-center mt-2 text-red-500 text-sm">{error}</p>;

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded overflow-hidden text-base border">
      {/* Header */}
      <div className="bg-purple-700 text-white text-center p-4 border-b">
        <h2 className="font-bold text-lg">Today's Panchang</h2>
        <p className="text-sm mt-1">Mumbai, Maharashtra, India</p>
      </div>

      {/* Date */}
      <div className="text-center border-b p-3">
        <p className="font-semibold text-base">
          {panchang?.day?.name}, {panchang?.date}
        </p>
      </div>

      {/* Sun & Moon Timings */}
      <div className="grid grid-cols-2 text-center text-base border-b">
        <div className="p-3 border-r">
          🌅 Sunrise <br />
          <BorderedText text={panchang?.sunrise || "N/A"} />
        </div>
        <div className="p-3">
          🌇 Sunset <br />
          <BorderedText text={panchang?.sunset || "N/A"} />
        </div>
        <div className="p-3 border-r border-t">
          🌙 Moonrise <br />
          <BorderedText text={panchang?.moonrise || "N/A"} />
        </div>
        <div className="p-3 border-t">
          🌌 Moonset <br />
          <BorderedText text={panchang?.moonset || "N/A"} />
        </div>
      </div>

      {/* Month */}
      <Row label="Month">
        <span>Amanta: {panchang?.masa?.split(" / ")[0] || "N/A"}</span>
        <span>Purnimanta: {panchang?.masa?.split(" / ")[1] || "N/A"}</span>
      </Row>

   

      {/* Tithi */}
      {panchang?.tithi && (
        <Row label="Tithi">
          <BorderedText text={panchang.tithi?.name} />
          <span>till</span>
          <BorderedText text={panchang.tithi?.end} />
        </Row>
      )}

      {/* Nakshatra */}
      {panchang?.nakshatra && (
        <Row label="Nakshatra">
          <BorderedText text={panchang.nakshatra?.name} />
          <span>till</span>
          <BorderedText text={panchang.nakshatra?.end} />
        </Row>
      )}

      {/* Yog */}
      {panchang?.yog && (
        <Row label="Yog">
          <BorderedText text={panchang.yog?.name} />
          <span>till</span>
          <BorderedText text={panchang.yog?.end} />
        </Row>
      )}

      {/* Karan */}
      {panchang?.karan && (
        <Row label="Karan">
          <BorderedText text={panchang.karan?.name} />
          <span>till</span>
          <BorderedText text={panchang.karan?.end} />
        </Row>
      )}
    </div>
  );
}
