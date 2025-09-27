import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import socket from "./socket"; // shared socket instance

export default function ChatPage() {
  const { consultationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [modalImg, setModalImg] = useState(null);
  const [consultationEnded, setConsultationEnded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const [keyboardPadding, setKeyboardPadding] = useState(0);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendRate, setExtendRate] = useState(0);
  const [extendMinutes, setExtendMinutes] = useState(5);
  const [userWallet, setUserWallet] = useState(0);

  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = currentUser?.id || "guest";
  const roomId = consultationId;

 
useEffect(() => {
  if (!roomId) return;
  setSecondsLeft(50);

  const fetchConsultation = async () => {
    try {
      const res = await fetch(
        `https://bhavanaastro.onrender.com/api/consultations/${roomId}/details`
      );
      const data = await res.json();
      console.log("Fetched consultation data:", data);
      setExtendRate(data.ratePerMinute || 0);
    } catch (err) {
      console.error("Failed to fetch consultation rate:", err);
    }
  };

  const fetchWallet = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(
        `https://bhavanaastro.onrender.com/api/users/${currentUser.id}/details`
      );
      const data = await res.json();
      console.log("Fetched user wallet:", data.wallet?.balance);
      setUserWallet(data.wallet?.balance || 0);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    }
  };

  fetchConsultation();
  fetchWallet();
}, [roomId, currentUser?.id]);

// Show extend modal when time is almost up
useEffect(() => {
  console.log(
    "Checking extend modal conditions:",
    secondsLeft,
    showExtendModal,
    consultationEnded,
    extendRate,
    userWallet
  );

  if (
    secondsLeft !== null &&
    secondsLeft <= 60 &&
    !showExtendModal &&
    !consultationEnded &&
    extendRate > 0
  ) {
    const maxMinutes = Math.floor(userWallet / extendRate);
    console.log("Max minutes possible for extension:", maxMinutes);
    if (maxMinutes > 0) {
      setExtendMinutes(Math.min(5, maxMinutes));
      console.log("Showing extend modal for", Math.min(5, maxMinutes), "minutes");
      setShowExtendModal(true);
    } else {
      console.log("User does not have enough balance to extend");
    }
  }
}, [secondsLeft, userWallet, showExtendModal, consultationEnded, extendRate]);


  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, keyboardPadding]);

  // Keyboard padding detection
  useEffect(() => {
    const handleResize = () => {
      const diff = document.documentElement.clientHeight - window.innerHeight;
      setKeyboardPadding(diff > 0 ? diff : 0);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show extend modal when time is almost up
  useEffect(() => {
    if (
      secondsLeft !== null &&
      secondsLeft <= 60 &&
      !showExtendModal &&
      !consultationEnded &&
      extendRate > 0
    ) {
      const maxMinutes = Math.floor(userWallet / extendRate);
      if (maxMinutes > 0) {
        setExtendMinutes(Math.min(5, maxMinutes));
        setShowExtendModal(true);
      }
    }
  }, [secondsLeft, userWallet, showExtendModal, consultationEnded, extendRate]);

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

  const extendConsultation = async () => {
    const extendCost = extendMinutes * extendRate;
    if (userWallet < extendCost) {
      alert(`Insufficient balance. You have ₹${userWallet}`);
      setShowExtendModal(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await fetch(`https://bhavanaastro.onrender.com/api/users/${userId}/deduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: extendCost, consultationId: roomId }),
      });

      setUserWallet((prev) => prev - extendCost);
      socket.emit("startConsultationTimer", { roomId, durationMinutes: extendMinutes });
      setShowExtendModal(false);
    } catch (err) {
      console.error("Failed to extend consultation:", err);
      alert("Failed to extend consultation. Try again.");
    }
  };

  const sendMessage = () => {
    if (!input.trim() || consultationEnded) return;
    const newMsg = { sender: userId, text: input };
    socket.emit("sendMessage", { roomId, ...newMsg });
    setInput("");
  };

  const formatTime = (sec) => {
    if (sec === null) return "Waiting...";
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 text-lg font-semibold flex justify-between items-center">
        <span>Chat Room ({consultationId})</span>
        <div className="flex items-center gap-2">
          <span className="bg-purple-900 px-3 py-1 rounded">{formatTime(secondsLeft)}</span>
          <button
            onClick={() => endConsultation("❌ Consultation ended by user")}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
          >
            End Consultation
          </button>
        </div>
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

      {/* Input */}
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

      {/* Kundali modal */}
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

      {/* Extend modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">
              ⏰ Consultation is about to end.<br/>
              Wallet: ₹{userWallet}<br/>
              Extend {extendMinutes} min at ₹{extendRate}/min = ₹{extendMinutes * extendRate}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={extendConsultation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Yes, Extend
              </button>
              <button
                onClick={() => setShowExtendModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                No, End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
