import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://bhavanaastro.onrender.com");

export default function AstrologerChat() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ store user once instead of parsing every time
  const user = JSON.parse(sessionStorage.getItem("user"));
  const senderId = user?.id;

  useEffect(() => {
    if (!consultationId) return;

    // ✅ Join room
    socket.emit("joinRoom", consultationId);

    // ✅ Load chat history
    fetch(`https://bhavanaastro.onrender.com/api/consultations/${consultationId}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    // ✅ Listen for incoming messages
 socket.on("newMessage", (msg) => {
  setMessages((prev) => [...prev, msg]);
});

    return () => {
      socket.off("newMessage");
      socket.emit("leaveRoom", consultationId); // optional cleanup
    };
  }, [consultationId]);

  // ✅ Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = () => {
  if (!text.trim()) return;
  socket.emit("sendMessage", { roomId: consultationId, sender: senderId, text });
  setText("");
};


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 text-lg font-semibold">
        Consultation Chat ({consultationId})
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                m.sender === senderId
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex border-t bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 mr-2"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
