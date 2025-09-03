import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserConsultancy() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingConsultationId, setStartingConsultationId] = useState(null);
  const [activeTab, setActiveTab] = useState("Chat"); // "Chat", "Video", "Voice"
  const [userBalance, setUserBalance] = useState(0); // user wallet balance

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

    const fetchUserBalance = async () => {
      const currentUser = JSON.parse(sessionStorage.getItem("user"));
      if (!currentUser?.id) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/users/${currentUser.id}/details`
        );
        setUserBalance(res.data.wallet?.balance || 0);
      } catch (err) {
        console.error("Error fetching user balance:", err);
      }
    };

    fetchAstrologers();
    fetchUserBalance();
  }, [navigate]);

  const startConsultation = async (astrologerId, mode, route, rate) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (!currentUser?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const first5MinCost = rate * 5; // calculate first 5 minutes cost

    // Check wallet balance
    if (userBalance < first5MinCost) {
      alert(
        `Insufficient wallet balance. First 5 min cost: ₹${first5MinCost}`
      );
      navigate("/user/wallet");
      return;
    }

    setStartingConsultationId(astrologerId);

    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations",
        {
          userId: currentUser.id,
          astrologerId,
          topic: mode === "Chat" ? "General Chat" : `${mode} Call`,
          mode,
          rate, // send rate so backend can calculate first5MinCost
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user balance in frontend immediately
      setUserBalance((prev) => prev - first5MinCost);

      navigate(`${route}/${res.data._id}`, { state: { mode } });
    } catch (err) {
      console.error(`Error starting ${mode}:`, err);
      alert(`Failed to start ${mode}. Try again.`);
    } finally {
      setStartingConsultationId(null);
    }
  };

  // Filter astrologers based on active tab
  const filtered = consultations.filter((c) => {
    if (activeTab === "Chat") return c.online?.chat;
    if (activeTab === "Video") return c.online?.video;
    if (activeTab === "Voice") return c.online?.audio;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">
        Consultations
      </h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Chat", "Video", "Voice"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading astrologers...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">
          No astrologers available for {activeTab}.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition flex flex-col items-center text-center"
            >
              <img
                src={c.photo || "https://via.placeholder.com/150"}
                alt={c.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-purple-200"
              />
              <h3 className="text-xl font-bold text-purple-700 mb-1">
                {c.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {c.systemsKnown?.join(", ") || ""}
              </p>
              <p className="text-gray-500 mb-1">Exp - {c.experience} yrs</p>
              <p className="text-gray-500 mb-1">
                {c.languagesKnown?.join(", ") || ""}
              </p>
              <p className="text-gray-500 mb-4">
                {c.categories?.join(", ") || ""}
              </p>

              {/* Buttons for all three modes */}
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() =>
                    startConsultation(
                      c._id,
                      "Chat",
                      "/chat",
                      c.rates?.chat || 0
                    )
                  }
                  disabled={!c.online?.chat || startingConsultationId === c._id}
                  className={`px-4 py-2 text-white rounded-lg ${
                    !c.online?.chat
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  Chat ₹{c.rates?.chat || 0}
                </button>

                <button
                  onClick={() =>
                    startConsultation(
                      c._id,
                      "Video",
                      "/video-call",
                      c.rates?.video || 0
                    )
                  }
                  disabled={!c.online?.video || startingConsultationId === c._id}
                  className={`px-4 py-2 text-white rounded-lg ${
                    !c.online?.video
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Video ₹{c.rates?.video || 0}
                </button>

                <button
                  onClick={() =>
                    startConsultation(
                      c._id,
                      "Audio",
                      "/video-call",
                      c.rates?.audio || 0
                    )
                  }
                  disabled={!c.online?.audio || startingConsultationId === c._id}
                  className={`px-4 py-2 text-white rounded-lg ${
                    !c.online?.audio
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Voice ₹{c.rates?.audio || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
