import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function AstrologerConsultations() {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();
  const astrologer = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!astrologer?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const socket = io("https://bhavanaastro.onrender.com"); // Create socket inside useEffect

    // Join astrologer's room
    socket.emit("joinAstrologerRoom", astrologer.id);

    const fetchConsultations = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/consultations/${astrologer.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const uniqueConsultations = Array.from(
          new Map(res.data.map((c) => [c._id, c])).values()
        );
        setConsultations(uniqueConsultations || []);
      } catch (err) {
        console.error("Error fetching consultations", err);
      }
    };

    fetchConsultations();

    // Handle new consultation via socket
    const handleNewConsultation = (data) => {
      setConsultations((prev) => [data, ...prev]);

      if (Notification.permission === "granted") {
        new Notification("New Consultation", {
          body: "A new consultation has been booked. Please check your dashboard.",
        });
      }
    };

    socket.on("newConsultation", handleNewConsultation);

    // Request Notification permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      socket.off("newConsultation", handleNewConsultation);
      socket.disconnect();
    };
  }, [astrologer?.id, navigate]);

  const handleStartChat = (consultationId) => {
    navigate(`/astrologer/chat/${consultationId}`);
  };

  const handleStartVideoCall = (consultationId) => {
    navigate(`/video-call/${consultationId}`);
  };

  const handleEndChat = async (consultationId) => {
    const confirmEnd = window.confirm(
      "Are you sure you want to end this chat? This will delete the consultation."
    );
    if (!confirmEnd) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `https://bhavanaastro.onrender.com/api/consultations/${consultationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConsultations((prev) =>
        prev.filter((c) => c._id !== consultationId)
      );
    } catch (err) {
      console.error("Error ending consultation", err);
      alert("Failed to end consultation. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">📅 Consultations</h1>

      {consultations.length === 0 ? (
        <p className="text-gray-500">No consultations booked yet.</p>
      ) : (
        <div className="grid gap-6">
          {consultations.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-purple-600 text-4xl" />
                <div>
                  <h2 className="font-semibold text-lg">{c.userName || "User"}</h2>
                  <p className="text-gray-600 text-sm">
                    DOB: {c.dob ? new Date(c.dob).toLocaleDateString() : "-"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Topic: <span className="font-medium">{c.topic || "-"}</span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Booked At:{" "}
                    {c.bookedAt ? new Date(c.bookedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => handleStartVideoCall(c._id)}
                >
                  Start Video Call
                </button>

                <button
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={() => handleStartChat(c._id)}
                >
                  Start Chat
                </button>

                <button
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => handleEndChat(c._id)}
                >
                  End Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
