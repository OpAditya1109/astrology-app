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
          `https://bhavanaastro.onrender.com/api/astrologers/${id}`
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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center">
        <img
          src={astrologer.photo || "https://via.placeholder.com/150"}
          alt={astrologer.name}
          className="w-32 h-32 rounded-full object-cover mb-4 mx-auto border-4 border-purple-200"
        />
        <h2 className="text-2xl font-bold text-purple-700 mb-2">
          {astrologer.name}
        </h2>
        <p className="text-gray-600 mb-2">
          Experience: {astrologer.experience} years
        </p>
        <p className="text-gray-600 mb-2">
          Languages: {astrologer.languagesKnown?.join(", ") || "N/A"}
        </p>
        <p className="text-gray-600 mb-2">
          Categories: {astrologer.categories?.join(", ") || "N/A"}
        </p>
        <p className="text-gray-600 mb-2">
          Systems Known: {astrologer.systemsKnown?.join(", ") || "N/A"}
        </p>
        <p className="text-gray-600 mb-4">
          Location: {astrologer.city}, {astrologer.country}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}
