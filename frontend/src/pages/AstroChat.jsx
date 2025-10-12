import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstroChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
          alert("Please login first.");
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const token = parsedUser.token; // token from user object
        if (!parsedUser.id || !token) {
          alert("Please login first.");
          navigate("/login");
          return;
        }

        setUserProfile(parsedUser);

        setMessages([
          {
            sender: "bot",
            text: `👋 Hello! How can I help you as an astrologer?\nI already have your birth details:\n- DOB: ${parsedUser.dob?.split("T")[0]}\n- Birth Time: ${parsedUser.birthTime}\n- Birth Place: ${parsedUser.birthPlace}`,
          },
        ]);
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Please login first.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const sendMessage = async () => {
    if (!input.trim() || !userProfile) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const token = userProfile.token;

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/chatbot/chat", // Falcon 7B backend route
        { query: input, profile: userProfile },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting astrologer." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-[400px] mx-auto mt-6 border border-gray-300 rounded-xl p-4 flex flex-col bg-white shadow">
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

      <div className="flex mt-3">
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
    </div>
  );
}
