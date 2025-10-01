// src/pages/AstrologerConsultations.jsx
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { messaging } from "../firebase"; // make sure your firebase.js exports messaging
import { getToken } from "firebase/messaging";

export default function AstrologerConsultations() {
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const astrologer = JSON.parse(sessionStorage.getItem("user"));

  // Read mode from query param
  const query = new URLSearchParams(location.search);
  const modeFromQuery = query.get("mode"); // "Chat", "Video", "Audio"

  // Function to register FCM token
  const registerFcmToken = async () => {
    try {
      if (!astrologer?.id) return;

      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_PUBLIC_VAPID_KEY,
      });

      if (token) {
        await axios.post(
          "https://bhavanaastro.onrender.com/api/save-fcm-token",
          { astrologerId: astrologer.id, token }
        );
        console.log("FCM token registered successfully");
      }
    } catch (err) {
      console.error("FCM registration failed:", err);
    }
  };

  useEffect(() => {
    if (!astrologer?.id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // Register FCM token
    registerFcmToken();

    // Connect to socket
    const socket = io("https://bhavanaastro.onrender.com", {
      transports: ["websocket"],
    });
    socket.emit("joinAstrologerRoom", astrologer.id);

    // Fetch consultations
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
        console.error(err);
      }
    };
    fetchConsultations();

    // Handle new consultation
    const handleNewConsultation = (data) => {
      setConsultations((prev) => [data, ...prev]);

      // Send message to native app via WebView (if available)
      if (window.AndroidApp?.postMessage) {
        window.AndroidApp.postMessage(
          JSON.stringify({
            type: "NEW_CONSULTATION",
            mode: data.mode,
            userName: data.userName || "User",
          })
        );
      }

      // Browser notification
      if (Notification.permission === "granted") {
        new Notification("New Consultation", {
          body: `New ${data.mode || "consultation"} booked by ${
            data.userName || "User"
          }`,
        });
      }
    };

    socket.on("newConsultation", handleNewConsultation);

    // Request notification permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("newConsultation", handleNewConsultation);
      socket.disconnect();
    };
  }, [astrologer?.id, navigate]);

  const handleStartChat = (consultationId) =>
    navigate(`/astrologer/chat/${consultationId}?mode=Chat`);
  const handleStartVideoCall = (consultationId) =>
    navigate(`/video-call/${consultationId}?mode=Video`);
  const handleStartAudioCall = (consultationId) =>
    navigate(`/audio-call/${consultationId}?mode=Audio`);

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
      console.error(err);
      alert("Failed to end consultation. Please try again.");
    }
  };

  const filteredConsultations = modeFromQuery
    ? consultations.filter((c) => c.mode === modeFromQuery)
    : consultations;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">Consultations</h1>

      {filteredConsultations.length === 0 ? (
        <p className="text-gray-500">No consultations booked yet.</p>
      ) : (
        <div className="grid gap-6">
          {filteredConsultations.map((c) => (
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
                    Mode: <span className="font-medium">{c.mode}</span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Booked At: {c.bookedAt ? new Date(c.bookedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {c.mode === "Chat" && (
                  <button
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    onClick={() => handleStartChat(c._id)}
                  >
                    Start Chat
                  </button>
                )}
                {c.mode === "Video" && (
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => handleStartVideoCall(c._id)}
                  >
                    Start Video Call
                  </button>
                )}
                {c.mode === "Audio" && (
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
          ))}
        </div>
      )}
    </div>
  );
}
