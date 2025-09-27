import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://bhavanaastro.onrender.com");

export default function AstrologerChat() {
  const { consultationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [modalImg, setModalImg] = useState(null);
  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [consultationEnded, setConsultationEnded] = useState(false);
  const [talkTime, setTalkTime] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const senderId = user?.id;

  useEffect(() => {
    if (!consultationId) return;

    socket.emit("joinRoom", consultationId);

    // Load chat history
    fetch(`https://bhavanaastro.onrender.com/api/consultations/${consultationId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        let msgs = [];
        if (Array.isArray(data)) msgs = data;
        else if (data?.messages && Array.isArray(data.messages)) msgs = data.messages;
        setMessages(msgs);
      })
      .catch(() => setMessages([]));

    const handleNewMessage = (msg) => setMessages((prev) => [...prev, msg]);

    // ✅ handle consultation ended
   // ✅ handle consultation ended (now receives talkTime directly from socket)
const handleConsultationEnded = ({ consultationId: endedId, talkTime }) => {
  if (endedId !== consultationId) return;

  setTalkTime(talkTime || null);
  setConsultationEnded(true);

  // auto redirect after 3s
  setTimeout(() => {
    navigate("/astrologer/dashboard/consultations");
  }, 3000);
};


    socket.on("newMessage", handleNewMessage);
    socket.on("consultationEnded", handleConsultationEnded);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("consultationEnded", handleConsultationEnded);
      socket.emit("leaveRoom", consultationId);
    };
  }, [consultationId, navigate]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, keyboardPadding]);

  // Keyboard fix
  useEffect(() => {
    const handleResize = () => {
      const diff = document.documentElement.clientHeight - window.innerHeight;
      setKeyboardPadding(diff > 0 ? diff : 0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sendMessage = () => {
    if (!text.trim() || consultationEnded) return;
    socket.emit("sendMessage", { roomId: consultationId, sender: senderId, text });
    setText("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 text-lg font-semibold">
        Chat Room ({consultationId})
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ paddingBottom: keyboardPadding + 70 }}
      >
        {messages.map((m, i) => {
          if (m.system) {
            return (
              <div key={i} className="flex justify-center">
                <div className="px-3 py-2 rounded-lg max-w-xs break-words bg-yellow-100 text-gray-800 text-center text-sm">
                  {m.text}
                  {m.kundaliUrl && (
                    <img
                      src={m.kundaliUrl}
                      alt="Kundali"
                      className="mt-2 rounded-lg border max-w-full cursor-pointer"
                      onClick={() => setModalImg(m.kundaliUrl)}
                    />
                  )}
                </div>
              </div>
            );
          }

          const isSender = m.sender === senderId;
          return (
            <div key={i} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                  isSender ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.text}
                {m.kundaliUrl && (
                  <img
                    src={m.kundaliUrl}
                    alt="Kundali"
                    className="mt-2 rounded-lg border max-w-full cursor-pointer"
                    onClick={() => setModalImg(m.kundaliUrl)}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* ✅ End message */}
        {consultationEnded && (
          <div className="text-center text-green-600 font-semibold mt-2">
            ✅ Consultation ended. {talkTime ? `You talked for ${talkTime}` : ""}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!consultationEnded && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 flex border-t bg-white"
          style={{ paddingBottom: keyboardPadding > 0 ? keyboardPadding : "env(safe-area-inset-bottom)" }}
        >
          <input
            ref={inputRef}
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
      )}

      {/* Kundali Modal */}
      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImg(null)}
        >
          <img
            src={modalImg}
            alt="Kundali Large"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
