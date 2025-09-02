import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AstroChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Get user session from sessionStorage
        const storedUser = sessionStorage.getItem("user");
        const token = sessionStorage.getItem("token");

        if (!storedUser || !token) {
          alert("Please login first.");
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        // If we already have user details in session, no need to call backend
        if (parsedUser?.id) {
          setUserProfile(parsedUser);

          setMessages([
            {
              sender: "bot",
              text: `👋 Hello! How can I help you as an astrologer? 
I already have your birth details:
- DOB: ${parsedUser.dob?.split("T")[0]}
- Birth Time: ${parsedUser.birthTime}
- Birth Place: ${parsedUser.birthPlace}`,
            },
          ]);
        } else {
          // fallback → fetch from backend if only userId stored
          const res = await axios.get(
            `http://localhost:5000/api/users/${parsedUser.id}/details`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (!res.data) {
            alert("Please login first.");
            navigate("/login");
            return;
          }

          setUserProfile(res.data);
          setMessages([
            {
              sender: "bot",
              text: `👋 Hello! How can I help you as an astrologer? 
I already have your birth details:
- DOB: ${res.data.dob?.split("T")[0]}
- Birth Time: ${res.data.birthTime}
- Birth Place: ${res.data.birthPlace}`,
            },
          ]);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Please login first.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { query: input, profile: userProfile },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting astrologer." },
      ]);
    }
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
      </div>

      <div className="flex mt-3">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
