import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import socket from "./socket"; // import shared socket

export default function ChatPage() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = currentUser?.id || "guest";
  const roomId = consultationId;

  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);

    fetch(`http://localhost:5000/api/consultations/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

const sendMessage = () => {
  if (!input.trim()) return;
  const newMsg = { sender: userId, text: input };
  socket.emit("sendMessage", { roomId, ...newMsg });
  setInput("");
};


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-purple-700 text-white p-4 text-lg font-semibold">
        Chat Room ({consultationId})
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
