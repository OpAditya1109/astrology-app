import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AIConsultation() {
  const [aiAstrologer, setAiAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAI = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/ai-astrologer");
        setAiAstrologer(res.data.astrologer || null); // corrected line
      } catch (err) {
        console.error("Failed to fetch AI astrologer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAI();
  }, []);

  const handleStartAIChat = async () => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    setStartingChat(true);

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/ai-astrologer/start/${currentUser.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const consultationId = res.data._id;
      navigate(`/chat/${consultationId}`);
    } catch (err) {
      console.error("Failed to start AI chat:", err);
      alert("Failed to start AI chat. Try again.");
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) return <p className="p-6">Loading AI astrologer...</p>;
  if (!aiAstrologer) return <p className="p-6 text-red-500">AI Astrologer not found.</p>;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">{aiAstrologer.name}</h2>
        <p className="text-gray-500 mb-6">{aiAstrologer.systemsKnown?.join(", ")}</p>
        <button
          onClick={handleStartAIChat}
          disabled={startingChat}
          className={`px-6 py-3 rounded-lg text-white ${
            startingChat ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {startingChat ? "Connecting..." : "Start AI Chat"}
        </button>
      </div>
    </div>
  );
}
