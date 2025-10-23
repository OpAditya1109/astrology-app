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
  const [aiAstrologers, setAiAstrologers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true); // ✅ for fade animation

  const heroImages = [astrologer1, astrologer2, astrologer3];

  // Preload images
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto slide with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setFade(true); // fade in
      }, 500); // fade duration = 500ms
    }, 4000); // 4s per slide
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
  // ✅ Fetch real astrologers and AI astrologers separately
useEffect(() => {
  const fetchAstrologers = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get("https://bhavanaastro.onrender.com/api/Consult-astrologers?isAI=false&limit=10"),
        axios.get("https://bhavanaastro.onrender.com/api/Consult-astrologers?isAI=true&limit=10"),
      ]);

      // Handle both possible response formats
      setAstrologers(res1.data.astrologers || res1.data || []);
      setAiAstrologers(res2.data.astrologers || res2.data || []);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    }
  };

  fetchAstrologers();
}, []);




  // Prevent back button exit
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}
          />

          {/* Left Arrow */}
          <button
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
                setFade(true);
              }, 500);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
          >
            ◀
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % heroImages.length);
                setFade(true);
              }, 500);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
          >
            ▶
          </button>
        </div>
      </section>

{/* 🧑‍🪄 Real Astrologers */}
<section className="max-w-7xl mx-auto px-6 py-8">
  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
    Our Astrologers
  </h2>
  <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
    {astrologers.length > 0 ? (
      astrologers.map((astro) => (
        <div
          key={astro._id}
          className="min-w-[220px] bg-white rounded-xl shadow-md p-4 flex-shrink-0 text-center border hover:shadow-lg transition"
        >
          <img
            src={astro.photo || "/default-astrologer.png"}
            alt={astro.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            {astro.name}
          </h3>
          <p className="text-sm text-gray-500">{astro.experience} yrs exp</p>
          <p className="text-sm text-gray-600">
            {astro.languagesKnown?.join(", ")}
          </p>
          <p className="text-xs text-gray-500">
            {astro.city}, {astro.country}
          </p>
          <Link
            to={`/astrologer/${astro._id}`}
            className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
          >
            Chat Now
          </Link>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No astrologers available right now.</p>
    )}
  </div>
</section>

{/* 🤖 AI Astrologers */}
<section className="max-w-7xl mx-auto px-6 py-8">
  <h2 className="text-2xl font-semibold mb-4 text-purple-700">
    AI Astrologers
  </h2>
  <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
    {aiAstrologers.length > 0 ? (
      aiAstrologers.map((astro) => (
        <div
          key={astro._id}
          className="min-w-[220px] bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md p-4 flex-shrink-0 text-center border hover:shadow-xl transition"
        >
          <img
            src={astro.photo || "/ai.png"}
            alt={astro.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-purple-800">
            {astro.name}
          </h3>
          <p className="text-sm text-gray-500">
            {astro.systemsKnown?.join(", ") || "AI Astrological Model"}
          </p>
          <p className="text-sm text-gray-600">
            {astro.languagesKnown?.join(", ")}
          </p>
          <Link
            to="/ai-consultancy"
            className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
          >
            Chat with AI
          </Link>
        </div>
      ))
    ) : (
      <p className="text-gray-500">AI astrologer not available right now.</p>
    )}
  </div>
</section>



{/* 🌟 Consultation Call Section */}
<section className="bg-[#FFF6F1] py-14 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto rounded-3xl mt-10 shadow-lg overflow-hidden">
  {/* Left Content */}
  <div className="md:w-1/2 mb-8 md:mb-0">
    <h2 className="text-3xl md:text-4xl font-bold text-[#7b1f24] mb-4 leading-snug">
      Talk To India’s Top Astrologer Today!
    </h2>
    <p className="text-gray-700 leading-relaxed mb-6">
      Get personalized astrological guidance for love, career, health, marriage, 
      and more. Our expert astrologers bring over five decades of trusted experience 
      in Vedic astrology, palmistry, numerology, and kundli analysis — helping you 
      find clarity and confidence in every step of life.
    </p>

    <Link
      to="/VipAstrologer"
      className="inline-block bg-[#f94c28] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#d53c20] transition-all shadow-md"
    >
      Book Now
    </Link>
  </div>

  {/* Right Image */}
  <div className="md:w-1/2 flex justify-center">
    <img
      src="/Astro-Bhavana.png"
      alt="Consultation Call"
      className="rounded-xl shadow-lg w-full max-w-sm md:max-w-md lg:max-w-md"
    />
  </div>
</section>
        {/* <PanchangCard /> */}

{/* ================= Services Section ================= */}
<section className="relative max-w-7xl mx-auto px-6 py-20 overflow-hidden">
  {/* CRAZY Neon Heading */}
<h2 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-center mb-10 sm:mb-14 md:mb-16 relative leading-tight">
  {"Our Services".split("").map((char, i) => (
    <span
      key={i}
      className="inline-block animate-char-wave"
      style={{ animationDelay: `${i * 0.08}s` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ))}
</h2>


  {/* Services Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
    {services.map((s, i) => (
      <div
        key={i}
        className="relative group rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 bg-white/5 backdrop-blur-md transform transition-all duration-700 animate-float-crazy hover:scale-110"
      >
        {/* Neon Border */}
        <div className="absolute inset-0 border-2 border-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 rounded-3xl opacity-50 animate-border-flicker"></div>

        {/* Image */}
        <img
          src={s.image}
          alt={s.title}
          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-115 animate-wobble"
        />

        {/* Overlay */}
<div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5
  opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700">

          <h3 className="text-2xl font-extrabold text-white drop-shadow-lg translate-y-10 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 animate-glow-flicker">
            {s.title}
          </h3>
          <p className="text-sm text-gray-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {s.desc}
          </p>
          {s.link && (
            <Link
              to={s.link}
              className="mt-4 px-5 py-2 bg-black text-white rounded-full text-sm md:text-base font-bold shadow-neon hover:shadow-neon hover:scale-110 hover:-translate-y-1 transition-all duration-500 animate-pulse-fast"
            >
              Explore
            </Link>
          )}
          {s.chat && (
            <Link
              to="/login"
              className="mt-2 px-5 py-2 bg-yellow-500 text-black rounded-full text-sm md:text-base font-bold shadow-neon hover:shadow-neon hover:scale-110 hover:-translate-y-1 transition-all duration-500 animate-pulse-fast"
            >
              Chat Now
            </Link>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* Tailwind / Custom Animations */}
  <style>{`
    /* Float crazy for cards */
    
    /* Neon border flicker */
    @keyframes border-flicker {
      0%,50%,100% { opacity: 0.6; }
      25%,75% { opacity: 1; }
    }
    .animate-border-flicker { animation: border-flicker 1.5s infinite; }

    /* Character wave yellow-black left to right */
    @keyframes char-wave {
      0%,100% { color: black; text-shadow: 0 0 2px #000; }
      50% { color: #FFD700; text-shadow: 0 0 10px #FFD700; }
    }
    .animate-char-wave {
      display: inline-block;
      animation: char-wave 3s ease-in-out infinite alternate;
    }

    /* Text glow flicker */
    @keyframes glow-flicker {
      0%,100%{ text-shadow: 0 0 5px #FFD700, 0 0 10px #FF00FF; }
      50% { text-shadow: 0 0 20px #FFD700, 0 0 30px #FF00FF; }
    }
    .animate-glow-flicker { animation: glow-flicker 1.5s infinite; }

    

    /* Button pulse fast */
    @keyframes pulse-fast {
      0%,100%{ transform: scale(1);}
      50%{ transform: scale(1.1);}
    }
    .animate-pulse-fast { animation: pulse-fast 1s infinite; }

    /* Neon shadow for buttons */
    .shadow-neon {
      box-shadow: 0 0 8px rgba(255, 215, 0, 0.6), 0 0 16px rgba(255, 0, 255, 0.4);
    }
  `}</style>
</section>



    </div>
  );
}
