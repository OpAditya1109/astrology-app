import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import socket from "./socket"; // shared socket instance

export default function ChatPage() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(null); // null = timer not started
  const [modalImg, setModalImg] = useState(null);
  const [consultationEnded, setConsultationEnded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = currentUser?.id || "guest";
  const roomId = consultationId;

  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) socket.connect();

    socket.emit("joinRoom", roomId);

    const userData = JSON.parse(sessionStorage.getItem("user"));
    const introSentKey = `introSent_${roomId}`;
    if (userData && !sessionStorage.getItem(introSentKey)) {
      const introMessage = {
        sender: userData.id,
        text: `👤 Name: ${userData.name}\n📅 DOB: ${new Date(
          userData.dob
        ).toLocaleDateString("en-IN")}\n🕒 Birth Time: ${
          userData.birthTime || "-"
        }\n📍 Birth Place: ${userData.birthPlace || "-"}`,
        kundaliUrl: userData.kundaliUrl || null,
        system: true,
      };
      socket.emit("sendMessage", { roomId, ...introMessage });
      sessionStorage.setItem(introSentKey, "true");
    }

    fetch(`https://bhavanaastro.onrender.com/api/consultations/${roomId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
        else if (data?.messages && Array.isArray(data.messages)) setMessages(data.messages);
        else setMessages([]);
      })
      .catch(() => setMessages([]));

    // --- Socket handlers ---
    const handleNewMessage = (message) => setMessages((prev) => [...prev, message]);
    const handleTimerUpdate = ({ secondsLeft }) => setSecondsLeft(secondsLeft);
    const handleTimerEnd = () => endConsultation("⏰ Consultation timer ended!");
    const handleConsultationEnded = ({ consultationId: endedId }) => {
      if (endedId === roomId) endConsultation("⏰ Consultation has been ended by the astrologer!");
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("timerUpdate", handleTimerUpdate);
    socket.on("timerEnded", handleTimerEnd);
    socket.on("consultationEnded", handleConsultationEnded);

    const handleBeforeUnload = (e) => {
      if (!isEnding) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave the chat?";
      }
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
  }, [roomId, isEnding]);

  // Auto-scroll when messages or keyboard open
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, keyboardPadding]);

  // Keyboard padding detection
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.clientHeight;
      const diff = docHeight - viewportHeight;
      setKeyboardPadding(diff > 0 ? diff : 0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const endConsultation = async (alertMessage) => {
    setIsEnding(true);
    alert(alertMessage);
    setSecondsLeft(0);
    setConsultationEnded(true);

    try {
      const token = sessionStorage.getItem("token");
      await fetch(`https://bhavanaastro.onrender.com/api/consultations/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      socket.emit("consultationEnded", { consultationId: roomId });
    } catch (err) {
      console.error("Failed to delete consultation:", err);
    }

    socket.emit("stopConsultationTimer", { roomId });
    socket.emit("leaveRoom", roomId);
    socket.disconnect();

    setTimeout(() => {
      window.location.href = "/user/consultancy";
    }, 3000);
  };

  const sendMessage = () => {
    if (!input.trim() || consultationEnded) return;
    const newMsg = { sender: userId, text: input };
    socket.emit("sendMessage", { roomId, ...newMsg });
    setInput("");
  };

  const formatTime = (sec) => {
    if (sec === null) return "Waiting..."; // timer not started
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

      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ paddingBottom: keyboardPadding + 70 }}
      >
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
            {msg.kundaliUrl && (
              <img
                src={msg.kundaliUrl}
                alt="Kundali"
                className="mt-2 rounded-lg border max-w-full cursor-pointer"
                onClick={() => setModalImg(msg.kundaliUrl)}
              />
            )}
          </div>
        ))}
        {consultationEnded && (
          <div className="text-center text-red-600 font-semibold mt-2">
            ⏰ Consultation has ended
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 flex border-t bg-white"
        style={{ paddingBottom: keyboardPadding > 0 ? keyboardPadding : "env(safe-area-inset-bottom)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={consultationEnded}
          className="flex-1 border rounded-lg px-3 py-2 mr-2 disabled:bg-gray-200"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={consultationEnded}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>

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
