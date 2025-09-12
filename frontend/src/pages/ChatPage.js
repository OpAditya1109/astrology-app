import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socket from "./socket"; // shared socket instance

export default function ChatPage() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = currentUser?.id || "guest";
  const roomId = consultationId;

  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) socket.connect();

    // Join room
    socket.emit("joinRoom", roomId);

    // Start consultation timer
    socket.emit("startConsultationTimer", { roomId, durationMinutes: 5 });

    // Send intro message only once per consultation
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const introSentKey = `introSent_${roomId}`;
    if (userData && !sessionStorage.getItem(introSentKey)) {
      const introMessage = {
        sender: userData.id,
        text: `👤 Name: ${userData.name}\n📅 DOB: ${new Date(
          userData.dob
        ).toLocaleDateString("en-IN")}\n🕒 Birth Time: ${userData.birthTime || "-"}\n📍 Birth Place: ${userData.birthPlace || "-"}`,
        system: true,
      };
      socket.emit("sendMessage", { roomId, ...introMessage });
      sessionStorage.setItem(introSentKey, "true");
    }

    // Fetch existing messages
    fetch(`https://bhavanaastro.onrender.com/api/consultations/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
        else if (data?.messages && Array.isArray(data.messages)) setMessages(data.messages);
        else setMessages([]);
      })
      .catch(() => setMessages([]));

    // Listeners
    const handleNewMessage = (message) => setMessages((prev) => [...prev, message]);
    socket.on("newMessage", handleNewMessage);

    const handleTimerUpdate = ({ secondsLeft }) => setSecondsLeft(secondsLeft);
    socket.on("timerUpdate", handleTimerUpdate);

    // Timer end
    const handleTimerEnd = () => {
      endConsultation("⏰ Consultation timer ended!");
    };

    // If astrologer ends consultation manually
    const handleConsultationEnded = ({ consultationId: endedId }) => {
      if (endedId === roomId) {
        endConsultation("⏰ Consultation has been ended by the astrologer!");
      }
    };

    socket.on("timerEnded", handleTimerEnd);
    socket.on("consultationEnded", handleConsultationEnded);

    // Warn before leaving
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave the chat?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("timerEnded", handleTimerEnd);
      socket.off("consultationEnded", handleConsultationEnded);
      socket.emit("stopConsultationTimer", { roomId });
      socket.emit("leaveRoom", roomId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  // Centralized end consultation logic
  const endConsultation = async (alertMessage) => {
    alert(alertMessage);
    setSecondsLeft(0); // stop timer

    try {
      const token = sessionStorage.getItem("token");

      // DELETE consultation from backend
      await fetch(`https://bhavanaastro.onrender.com/api/consultations/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Notify everyone in room
      socket.emit("consultationEnded", { consultationId: roomId });
    } catch (err) {
      console.error("Failed to delete consultation:", err);
    }

    // Disconnect user from socket room
    socket.emit("stopConsultationTimer", { roomId });
    socket.emit("leaveRoom", roomId);
    socket.disconnect();

    // Redirect to consultation summary page
    window.location.href = "/user/consultancy";
  };

  const sendMessage = () => {
    if (!input.trim() || secondsLeft <= 0) return;
    const newMsg = { sender: userId, text: input };
    socket.emit("sendMessage", { roomId, ...newMsg });
    setInput("");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-purple-700 text-white p-4 text-lg font-semibold flex justify-between items-center">
        <span>Chat Room ({consultationId})</span>
        <span className="bg-purple-900 px-3 py-1 rounded">{formatTime(secondsLeft)}</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs break-words ${
              msg.system
                ? "bg-yellow-100 text-gray-800 mx-auto text-sm text-center"
                : msg.sender === userId
                ? "bg-purple-600 text-white ml-auto"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 flex border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={secondsLeft <= 0}
          className="flex-1 border rounded-lg px-3 py-2 mr-2 disabled:bg-gray-200"
        />
        <button
          onClick={sendMessage}
          disabled={secondsLeft <= 0}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
