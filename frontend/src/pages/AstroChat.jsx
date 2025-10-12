import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstroChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [timer, setTimer] = useState(300); // 5 mins = 300s
  const [showExtendPopup, setShowExtendPopup] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(1);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch user profile (from sessionStorage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUserProfile(parsedUser);

    setMessages([
      {
        sender: "bot",
        text: `👋 Hello! I already have your birth details:\n- DOB: ${parsedUser.dob?.split("T")[0]}\n- Birth Time: ${parsedUser.birthTime}\n- Birth Place: ${parsedUser.birthPlace}`,
      },
    ]);
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (timer <= 0) {
      alert("Your chat session has ended.");
      navigate("/user/dashboard");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 60) setShowExtendPopup(true);

    return () => clearInterval(interval);
  }, [timer, navigate]);

  // Send chat message
  const sendMessage = async () => {
    if (!input.trim() || !userProfile) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
  const res = await axios.post(
  "https://bhavanaastro.onrender.com/api/chatbot/chat",
  { query: input, profile: userProfile }, // ✅ send profile, not just userId
  { headers: { Authorization: `Bearer ${userProfile.token}` } }
);


      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting astrologer." },
      ]);
    }
  };

  // Extend chat
  const handleExtendChat = async () => {
    if (!userProfile) return;

    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations/deduct",
        { userId: userProfile.id, minutes: extendMinutes } // send only userId & minutes
      );

      // Backend will handle rate, wallet deduction & validation
      if (res.data.success) {
        setTimer((prev) => prev + extendMinutes * 60); // extend timer
        alert(res.data.message || "Chat extended successfully!");
      } else {
        alert(res.data.message || "Insufficient balance.");
      }
      setShowExtendPopup(false);
    } catch (err) {
      console.error(err);
      alert("Failed to extend chat.");
      setShowExtendPopup(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-[400px] mx-auto mt-6 border border-gray-300 rounded-xl p-4 flex flex-col bg-white shadow">
      {/* Chat messages */}
      <div className="flex-1 flex flex-col gap-2 p-2 max-h-[400px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg max-w-[70%] ${
              msg.sender === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Timer */}
      <div className="flex justify-between mt-2 items-center">
        <span className="text-sm text-gray-500">
          ⏱ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
        </span>
      </div>

      {/* Input */}
      <div className="flex mt-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about your stars..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

      {/* Extend Popup */}
      {showExtendPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <h3 className="font-semibold text-lg mb-2">Extend Chat?</h3>
            <p>1 minute remaining. Do you want to extend?</p>
            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                min="1"
                value={extendMinutes}
                onChange={(e) => setExtendMinutes(Number(e.target.value))}
                className="border px-2 py-1 rounded w-16"
              />
              <span>minute(s) × ₹10 = ₹{extendMinutes * 10}</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowExtendPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleExtendChat}
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
