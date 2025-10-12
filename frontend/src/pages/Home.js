import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import { useEffect, useState } from "react";
import axios from "axios";

// Images
import kundliImg from "../assets/kundli.png";
import horoscopeImg from "../assets/horoscope.png";
import consultImg from "../assets/consult.png";
import matchmakingImg from "../assets/matchmaking.png";
import shopImg from "../assets/shop.png";
import courseImg from "../assets/course.png";

import astrologer1 from "../assets/astrologer1.png";
import astrologer2 from "../assets/astrologer2.png";
import astrologer3 from "../assets/astrologer3.jpg";

export default function Home() {
  const [astrologers, setAstrologers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const [query, setQuery] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    dob: "",
    birthTime: "",
    birthPlace: "",
  });

  const heroImages = [astrologer1, astrologer2, astrologer3];

  // Preload images
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const services = [
    { title: "Free Kundli", desc: "Generate your Janam Kundli instantly", image: kundliImg, link: "/free-kundali" },
    { title: "Horoscopes", desc: "Daily horoscopes", image: horoscopeImg, link: "/horoscopes" },
    { title: "Consult Astrologers", desc: "Chat or call expert astrologers", image: consultImg, chat: true },
    { title: "Matchmaking", desc: "Check Kundli compatibility", image: matchmakingImg, link: "/match-making" },
    { title: "Shop", desc: "Explore spiritual products & remedies", image: shopImg, link: "/shopping" },
    { title: "Courses", desc: "Join certified astrology & healing courses", image: courseImg, link: "/occult" },
  ];

  // Fetch astrologers
  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const res = await axios.get("https://bhavanaastro.onrender.com/api/Consult-astrologers?limit=10");
        setAstrologers(res.data.astrologers || []);
      } catch (error) {
        console.error("Error fetching astrologers:", error);
      }
    };
    fetchAstrologers();
  }, []);

  // Prevent back navigation exit
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // === AI Chat Function ===
  const handleAskAstro = async () => {
    if (!query || !profile.dob || !profile.birthTime || !profile.birthPlace) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("https://bhavanaastro.onrender.com/api/chat", {
        query,
        profile,
      });
      setAiReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setAiReply("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* ================= Hero Section ================= */}
      <section className="w-full mt-0 pt-4 relative">
        <div
          className="relative w-full overflow-hidden rounded-md"
          style={{ paddingBottom: "42%", maxHeight: "400px" }}
        >
          <img
            src={heroImages[currentIndex]}
            alt={`Astrologer ${currentIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </section>

      {/* ================= Our Astrologers Section ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Meet Our Expert Astrologers
          </h2>
        </div>

        <div className="flex overflow-x-auto gap-8 pb-6 scrollbar-hide snap-x snap-mandatory">
          {astrologers.length > 0 ? (
            astrologers.map((astro) => (
              <div
                key={astro._id}
                className="min-w-[260px] snap-center bg-white rounded-2xl shadow-lg p-6 flex-shrink-0 text-center border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2 relative overflow-hidden group"
              >
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <img
                    src={astro.photo || "/default-astrologer.png"}
                    alt={astro.name}
                    className="w-full h-full rounded-full object-cover border-4 border-purple-500/20 shadow-md"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{astro.name}</h3>
                <p className="text-sm text-purple-600 font-medium mb-2">{astro.experience} yrs experience</p>
                <Link
                  to="/login"
                  className="mt-5 inline-block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  Chat Now
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No astrologers available right now.</p>
          )}
        </div>
      </section>

      {/* ================= Services Section ================= */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 overflow-hidden">
        <h2 className="text-5xl font-extrabold text-center mb-16">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {services.map((s, i) => (
            <div
              key={i}
              className="relative group rounded-3xl overflow-hidden cursor-pointer shadow-2xl border bg-white/5 backdrop-blur-md transform transition-all duration-700 hover:scale-105"
            >
              <img src={s.image} alt={s.title} className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                <p className="text-sm text-gray-200 mt-2">{s.desc}</p>
                {s.link && (
                  <Link
                    to={s.link}
                    className="mt-4 px-5 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all duration-300"
                  >
                    Explore
                  </Link>
                )}
                {s.chat && (
                  <Link
                    to="/login"
                    className="mt-2 px-5 py-2 bg-yellow-500 text-black rounded-full text-sm font-bold hover:bg-yellow-400 transition-all duration-300"
                  >
                    Chat Now
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Ask AI Astrologer Section ================= */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-purple-700 mb-6">Ask AI Astrologer 🔮</h2>
        <p className="text-gray-600 mb-8">Get instant astrological insights using DOB, Time & Place.</p>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <input
            type="date"
            value={profile.dob}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-3"
            placeholder="Date of Birth"
          />
          <input
            type="time"
            value={profile.birthTime}
            onChange={(e) => setProfile({ ...profile, birthTime: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-3"
            placeholder="Time of Birth"
          />
          <input
            type="text"
            value={profile.birthPlace}
            onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 mb-3"
            placeholder="Place of Birth"
          />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-4"
            placeholder="Ask your question..."
            rows="3"
          ></textarea>

          <button
            onClick={handleAskAstro}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-all"
          >
            {loading ? "Reading stars..." : "Ask Now"}
          </button>

          {aiReply && (
            <div className="mt-6 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg p-4 text-left shadow-inner">
              <strong>AI Astrologer says:</strong>
              <p className="mt-2 whitespace-pre-line">{aiReply}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
