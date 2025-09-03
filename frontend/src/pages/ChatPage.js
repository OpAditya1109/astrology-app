import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socket from "./socket"; // import shared socket

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

  socket.emit("joinRoom", roomId);

  // Fetch existing messages
  fetch(`https://bhavanaastro.onrender.com/api/consultations/${roomId}/messages`)
    .then((res) => res.json())
    .then((data) => {
      // Ensure messages is always an array
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data?.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    })
    .catch(() => setMessages([]));

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };
  socket.on("newMessage", handleNewMessage);

  const handleTimerUpdate = ({ secondsLeft }) => {
    setSecondsLeft(secondsLeft);
  };
  socket.on("timerUpdate", handleTimerUpdate);

  const handleTimerEnd = () => {
    alert("⏰ Consultation timer ended!");
    setSecondsLeft(0);
  };
  socket.on("timerEnded", handleTimerEnd);

  return () => {
    socket.off("newMessage", handleNewMessage);
    socket.off("timerUpdate", handleTimerUpdate);
    socket.off("timerEnded", handleTimerEnd);
    socket.emit("stopConsultationTimer", { roomId });
    socket.emit("leaveRoom", roomId);
  };
}, [roomId]);


  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { sender: userId, text: input };
    socket.emit("sendMessage", { roomId, ...newMsg });
    setInput("");
  };

  // Format seconds as MM:SS
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
              msg.sender === userId
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
          className="flex-1 border rounded-lg px-3 py-2 mr-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
