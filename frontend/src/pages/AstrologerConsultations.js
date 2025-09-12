import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function AstrologerConsultations() {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const astrologer = JSON.parse(sessionStorage.getItem("user"));

  // Read mode from query param
  const query = new URLSearchParams(location.search);
  const modeFromQuery = query.get("mode"); // Could be "Chat", "Video", or "Audio"

  useEffect(() => {
    if (!astrologer?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const socket = io("https://bhavanaastro.onrender.com");

    socket.emit("joinAstrologerRoom", astrologer.id);

    const fetchConsultations = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/consultations/${astrologer.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Keep the actual mode from backend (don't default to "Chat")
        const uniqueConsultations = Array.from(
          new Map(res.data.map((c) => [c._id, c])).values()
        );

        setConsultations(uniqueConsultations || []);
      } catch (err) {
        console.error("Error fetching consultations", err);
      }
    };

    fetchConsultations();

    const handleNewConsultation = (data) => {
      setConsultations((prev) => [data, ...prev]);

      if (Notification.permission === "granted") {
        new Notification("New Consultation", {
          body: `New ${data.mode || "consultation"} booked by ${data.userName || "User"}`,
        });
      }
    };

    socket.on("newConsultation", handleNewConsultation);

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("newConsultation", handleNewConsultation);
      socket.disconnect();
    };
  }, [astrologer?.id, navigate]);

  const handleStartChat = (consultationId) => {
    navigate(`/astrologer/chat/${consultationId}?mode=Chat`);
  };

  const handleStartVideoCall = (consultationId) => {
    navigate(`/video-call/${consultationId}?mode=Video`);
  };

  const handleStartAudioCall = (consultationId) => {
    navigate(`/video-call/${consultationId}?mode=Audio`);
  };

  const handleEndChat = async (consultationId) => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this consultation? This will delete it."
    );
    if (!confirmEnd) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `https://bhavanaastro.onrender.com/api/consultations/${consultationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConsultations((prev) => prev.filter((c) => c._id !== consultationId));
    } catch (err) {
      console.error("Error ending consultation", err);
      alert("Failed to end consultation. Please try again.");
    }
  };

  // Filter consultations by selected mode (if modeFromQuery is provided)
  const filteredConsultations = modeFromQuery
    ? consultations.filter((c) => c.mode === modeFromQuery)
    : consultations;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6"> Consultations</h1>

      {filteredConsultations.length === 0 ? (
        <p className="text-gray-500">No consultations booked yet.</p>
      ) : (
        <div className="grid gap-6">
          {filteredConsultations.map((c) => {
            const modeToUse = c.mode; // Use backend mode directly

            return (
              <div
                key={c._id}
                className={`bg-white rounded-xl shadow p-5 flex items-center justify-between transition hover:shadow-lg ${
                  c.status === "ongoing" ? "border-2 border-green-500" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <FaUserCircle className="text-purple-600 text-4xl" />
                  <div>
                    <h2 className="font-semibold text-lg">{c.userName || "User"}</h2>
        

                    <p className="text-gray-600 text-sm">
                      Topic: <span className="font-medium">{c.topic || "-"}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Mode: <span className="font-medium">{modeToUse}</span>
                    </p>
                    <p className="text-gray-500 text-xs">
                      Booked At: {c.bookedAt ? new Date(c.bookedAt).toLocaleString() : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {modeToUse === "Chat" && (
                    <button
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      onClick={() => handleStartChat(c._id)}
                    >
                      Start Chat
                    </button>
                  )}

                  {modeToUse === "Video" && (
                    <button
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => handleStartVideoCall(c._id)}
                    >
                      Start Video Call
                    </button>
                  )}

                  {modeToUse === "Audio" && (
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => handleStartAudioCall(c._id)}
                    >
                      Start Audio Call
                    </button>
                  )}

                  <button
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => handleEndChat(c._id)}
                  >
                    End Consultation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
