import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserAIConsultancy() {
  const [aiAstrologers, setAiAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAstrologers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bhavanaastro.onrender.com/api/Consult-astrologers"
        );

        // Filter only AI astrologers
        const aiOnly = response.data.astrologers?.filter((a) => a.isAI === true);
        setAiAstrologers(aiOnly || []);
      } catch (error) {
        console.error("Error fetching AI astrologers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  // 🌟 Helper function to start AI chat
  const handleStartChat = async (astrologer) => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));

      if (!userData) {
        alert("Please login to start a consultation.");
        navigate("/login");
        return;
      }

      const userId = userData.id;
      const rate = 2; // ₹2/min for AI chat

      // 🔹 Call the new AI route that only deducts and credits
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations/ai",
        {
          userId,
          astrologerId: astrologer._id,
          rate,
        }
      );

      alert(res.data.message || "₹10 deducted for AI consultation.");
      navigate(`/astrochat/ai/${astrologer._id}`); // go to AI chat page

    } catch (error) {
      if (error.response?.data?.message === "Insufficient balance") {
        alert("You need at least ₹10 in your wallet to start an AI chat.");
      } else {
        console.error("Error starting AI consultation:", error);
        alert("Unable to start consultation. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8">
      <h2 className="text-4xl font-bold mb-10 text-purple-700 text-center">
        🪄 AI Astrologer Consultation
      </h2>

      {loading ? (
        <p className="text-gray-500 text-center text-lg">
          Loading AI astrologers...
        </p>
      ) : aiAstrologers.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No AI astrologers available.
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiAstrologers.map((astrologer) => (
            <div
              key={astrologer._id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 p-6 flex flex-col items-center text-center border border-purple-100"
            >
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={
                    astrologer.photo ||
                    "https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
                  }
                  alt={astrologer.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-300 shadow-md"
                />
                <span
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white bg-green-500"
                  title="AI Online 24/7"
                ></span>
              </div>

              {/* Name & Experience */}
              <h3 className="text-2xl font-semibold text-purple-700 mt-4 mb-1">
                {astrologer.name || "AI Astrologer"}
              </h3>
              <p className="text-gray-500 mb-2">
                {astrologer.experience
                  ? `${astrologer.experience} yrs experience`
                  : "Available 24/7"}
              </p>

              {/* Systems & Languages */}
              <p className="text-gray-500 text-sm mb-1">
                <strong>Systems:</strong>{" "}
                {astrologer.systemsKnown?.join(", ") || "Vedic Astrology"}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                <strong>Languages:</strong>{" "}
                {astrologer.languagesKnown?.join(", ") || "English, Hindi"}
              </p>

              {/* Specialty */}
              <p className="text-gray-500 text-sm mb-3">
                <strong>Specialty:</strong>{" "}
                {astrologer.categories?.join(", ") || "General Predictions"}
              </p>

              {/* Rates */}
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">
                    ₹20/min
                  </span>
                  <span className="text-purple-700 font-semibold text-lg">
                    ₹2/min
                  </span>
                </div>
                <span className="mt-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  🤖 AI Chat — Special Offer
                </span>
              </div>

              {/* Start Chat Button */}
              <button
                onClick={() => handleStartChat(astrologer)}
                className="mt-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
              >
                Start Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
