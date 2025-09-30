import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserConsultancy() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bhavanaastro.onrender.com/api/Consult-astrologers"
        );
        setConsultations(response.data.astrologers || []);
      } catch (error) {
        console.error("Error fetching astrologers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-4xl font-bold mb-10 text-purple-700 text-center">
        Find Your Astrologer
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center text-lg">Loading astrologers...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No astrologers available.</p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {consultations.map((astrologer) => (
            <div
              key={astrologer._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col items-center text-center"
            >
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={astrologer.photo || "https://via.placeholder.com/150"}
                  alt={astrologer.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-md"
                />
                {/* Online Badge */}
<span
  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
    astrologer.online?.chat || astrologer.online?.video || astrologer.online?.audio
      ? "bg-green-500"
      : "bg-red-500"
  }`}
  title={
    astrologer.online?.chat || astrologer.online?.video || astrologer.online?.audio
      ? "Online"
      : "Offline"
  }
/>

              </div>

              {/* Name & Experience */}
              <h3 className="text-2xl font-semibold text-purple-700 mt-4 mb-1">
                {astrologer.name}
              </h3>
              <p className="text-gray-500 mb-2">{astrologer.experience} yrs experience</p>

              {/* Systems & Languages */}
              <p className="text-gray-500 text-sm mb-1">
                <strong>Systems:</strong> {astrologer.systemsKnown?.join(", ") || "N/A"}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                <strong>Languages:</strong> {astrologer.languagesKnown?.join(", ") || "N/A"}
              </p>

              {/* Categories */}
              <p className="text-gray-500 text-sm mb-3">
                <strong>Specialty:</strong> {astrologer.categories?.join(", ") || "N/A"}
              </p>

           
            {/* Rates */}
<div className="flex gap-3 mb-4 flex-wrap justify-center">
  {astrologer.rates?.chat != null && (
    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
      💬 {astrologer.rates.chat === 0 ? "Free" : `₹${astrologer.rates.chat}/min`}
    </span>
  )}
  {astrologer.rates?.video != null && (
    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
      📹 {astrologer.rates.video === 0 ? "Free" : `₹${astrologer.rates.video}/min`}
    </span>
  )}
  {astrologer.rates?.audio != null && (
    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
      🎙 {astrologer.rates.audio === 0 ? "Free" : `₹${astrologer.rates.audio}/min`}
    </span>
  )}
</div>

              {/* View Profile Button */}
              <button
                onClick={() => navigate(`/astrologer/${astrologer._id}`)}
                className="mt-auto px-6 py-2 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
