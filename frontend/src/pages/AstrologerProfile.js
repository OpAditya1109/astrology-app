import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstrologerProfile() {
  const { id } = useParams(); // astrologer ID
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/Consult-astrologers/${id}`
        );
        setAstrologer(res.data);
      } catch (err) {
        console.error("Error fetching astrologer profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologer();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading profile...</p>;
  if (!astrologer) return <p className="text-red-500">Astrologer not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={astrologer.photo || "https://via.placeholder.com/150"}
            alt={astrologer.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-purple-200 shadow-md"
          />
          <h2 className="text-3xl font-bold text-purple-700 mb-1">
            {astrologer.name}
          </h2>
          <p className="text-gray-500 italic mb-4">
            {astrologer.city}, {astrologer.country}
          </p>
        </div>

        {/* Description */}
        {astrologer.description && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About Me
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {astrologer.description}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-700 font-semibold">Experience</p>
            <p className="text-gray-600">{astrologer.experience} years</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Languages</p>
            <p className="text-gray-600">
              {astrologer.languagesKnown?.join(", ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Categories</p>
            <p className="text-gray-600">
              {astrologer.categories?.join(", ") || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold">Systems Known</p>
            <p className="text-gray-600">
              {astrologer.systemsKnown?.join(", ") || "N/A"}
            </p>
          </div>

          {/* Rates Section */}
          <div>
            <p className="text-gray-700 font-semibold">Rates</p>
            <ul className="text-gray-600">
              <li>💬 Chat: {astrologer.rates?.chat ? `₹${astrologer.rates.chat}/min` : "N/A"}</li>
              <li>📹 Video: {astrologer.rates?.video ? `₹${astrologer.rates.video}/min` : "N/A"}</li>
              <li>🎙 Audio: {astrologer.rates?.audio ? `₹${astrologer.rates.audio}/min` : "N/A"}</li>
            </ul>
          </div>

          {/* Online Status Section */}
          <div>
            <p className="text-gray-700 font-semibold">Availability</p>
            <ul className="text-gray-600">
              <li>
                💬 Chat:{" "}
                <span
                  className={`${
                    astrologer.online?.chat
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }`}
                >
                  {astrologer.online?.chat ? "Online" : "Offline"}
                </span>
              </li>
              <li>
                📹 Video:{" "}
                <span
                  className={`${
                    astrologer.online?.video
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }`}
                >
                  {astrologer.online?.video ? "Online" : "Offline"}
                </span>
              </li>
              <li>
                🎙 Audio:{" "}
                <span
                  className={`${
                    astrologer.online?.audio
                      ? "text-green-600 font-medium"
                      : "text-red-600"
                  }`}
                >
                  {astrologer.online?.audio ? "Online" : "Offline"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-600 text-white px-8 py-2 rounded-lg hover:bg-purple-700 shadow-md"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
