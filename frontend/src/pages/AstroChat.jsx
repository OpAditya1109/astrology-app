import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstroChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [timer, setTimer] = useState(300);
  const [showExtendPopup, setShowExtendPopup] = useState(false);
  const [extendMinutes, setExtendMinutes] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tenSecondMessageSent, setTenSecondMessageSent] = useState(false);
  const [astrologerPhoto, setAstrologerPhoto] = useState("/default-astro.png");

  const astroPhotoRef = useRef(astrologerPhoto);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // Persist timer
  useEffect(() => {
    const savedTimer = sessionStorage.getItem("chatTimer");
    if (savedTimer) setTimer(Number(savedTimer));
  }, []);

  useEffect(() => {
    astroPhotoRef.current = astrologerPhoto;
  }, [astrologerPhoto]);

  useEffect(() => {
    sessionStorage.setItem("chatTimer", timer.toString());
  }, [timer]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Animate bot messages
  const typeMessage = (text, delay = 50) => {
    return new Promise((resolve) => {
      let i = 0;
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "", photo: astroPhotoRef.current },
      ]);
      const interval = setInterval(() => {
        setMessages((prev) => {
          const newPrev = [...prev];
          const lastIndex = newPrev.length - 1;
          newPrev[lastIndex].text = text.slice(0, i + 1);
          return newPrev;
        });
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  };

  // Load user profile and intro messages
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedAstroPhoto = sessionStorage.getItem("astrologerPhoto");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (storedAstroPhoto) {
      setAstrologerPhoto(storedAstroPhoto);
      astroPhotoRef.current = storedAstroPhoto;
    }

    const parsedUser = JSON.parse(storedUser);
    setUserProfile(parsedUser);
    const userName = parsedUser.name || "User";

    const introText = `👋 Namaste ${userName}! Welcome to AstroBhavana.

I am your personal astrologer AI. I provide guidance based on Vedic astrology, focusing on your strengths, opportunities, and life insights.

What would you like to ask today? 🌟`;

    const birthDetails = `Here are your birth details I have on record:
- DOB: ${parsedUser.dob?.split("T")[0]}
- Birth Time: ${parsedUser.birthTime}
- Birth Place: ${parsedUser.birthPlace}`;

    const animateMessages = async () => {
      await typeMessage(introText);
      await new Promise((r) => setTimeout(r, 500));
      await typeMessage(birthDetails);
    };

    animateMessages();
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      alert("Your chat session has ended.");
      navigate("/user/dashboard");
      return;
    }

    if (timer <= 10 && !tenSecondMessageSent && userProfile) {
      typeMessage(
        `✨ ${userProfile.name}, something important is about to happen in your life! Let's chat again to explore what the stars have in store for you. 🌟`
      );
      setTenSecondMessageSent(true);
    }

    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    if (timer === 60) setShowExtendPopup(true);

    return () => clearInterval(interval);
  }, [timer, navigate, tenSecondMessageSent, userProfile]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !userProfile) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/chatbot/chat",
        { query: input, profile: userProfile },
        { headers: { Authorization: `Bearer ${userProfile.token}` } }
      );
      await typeMessage(res.data.reply);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting astrologer.", photo: astroPhotoRef.current },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Extend chat
  const handleExtendChat = async () => {
    if (!userProfile) return;
    try {
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/consultations/deduct",
        { userId: userProfile.id, minutes: extendMinutes }
      );
      if (res.data.success) {
        setTimer((prev) => prev + extendMinutes * 60);
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

  const handleEndChat = () => navigate("/user/dashboard");

return (
<div className="flex flex-col h-[calc(100vh-80px)] max-w-[400px] mx-auto border border-gray-300 rounded-xl bg-white shadow-lg pt-[100px] relative">

    
    {/* Chat Header (optional for title or astrologer info) */}
    {/* <div className="p-3 border-b font-semibold bg-white">AstroBhavana Chat</div> */}

    {/* Chat messages area — FIXED height and scrollable */}
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 mb-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <img
                src={msg.photo || astroPhotoRef.current}
                alt="Astrologer"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[75%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 animate-pulse flex items-center gap-2">
            <img
              src={astroPhotoRef.current}
              alt="Astrologer"
              className="w-8 h-8 rounded-full object-cover"
            />
            🤖 Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input section stays fixed at bottom of this area */}
      <div className="border-t border-gray-300 bg-white px-3 py-2">
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your stars..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>

        <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
          <span>
            ⏱ {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </span>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
            onClick={handleEndChat}
          >
            End Chat
          </button>
        </div>
      </div>
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
