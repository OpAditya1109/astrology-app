import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Import images for each service
import kundliImg from "../assets/kundli.png";
import horoscopeImg from "../assets/horoscope.png";
import consultImg from "../assets/consult.png";
import matchmakingImg from "../assets/matchmaking.png";
import shopImg from "../assets/shop.png";
import courseImg from "../assets/course.png";

// ✅ Import multiple hero images for slider
import astrologer1 from "../assets/astrologer1.png";
import astrologer2 from "../assets/astrologer2.png";
import astrologer3 from "../assets/astrologer3.jpg";

export default function Home() {
  const [astrologers, setAstrologers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = [astrologer1, astrologer2, astrologer3];

  // ✅ Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const services = [
    {
      title: "Free Kundli",
      desc: "Generate your Janam Kundli instantly",
      image: kundliImg,
      link: "/free-kundali",
    },
    {
      title: "Horoscopes",
      desc: "Daily horoscopes",
      image: horoscopeImg,
      link: "/horoscopes",
    },
    {
      title: "Consult Astrologers",
      desc: "Chat or call expert astrologers",
      image: consultImg,
      chat: true,
    },
    {
      title: "Matchmaking",
      desc: "Check Kundli compatibility",
      image: matchmakingImg,
      link: "/match-making",
    },
    {
      title: "Shop",
      desc: "Explore spiritual products & remedies",
      image: shopImg,
      link: "/shopping",
    },
    {
      title: "Courses",
      desc: "Join certified astrology & healing courses",
      image: courseImg,
      link: "/occult",
    },
  ];

  // ✅ Fetch astrologers from API
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

  // ✅ Prevent back button exit
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 
      ✅ Hero Section (COMMENTED OUT FOR NOW)
      <section className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-md shadow-md flex flex-col md:flex-row items-center justify-center text-center p-4 md:p-8">
        ... (all hero content here)
      </section>
      */}

<section className="w-full mt-0 pt-4">  {/* Added pt-4 for top padding */}
  <div
    className="relative w-full overflow-hidden"
    style={{
      paddingBottom: "40%",   // shorter height
      maxHeight: "800px"      // optional max height
    }}
  >
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-center bg-cover transition-all duration-700"
      style={{ backgroundImage: `url(${heroImages[currentIndex]})` }}
    />

    {/* Left Arrow */}
    <button
      onClick={() =>
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length
        )
      }
      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
    >
      ◀
    </button>

    {/* Right Arrow */}
    <button
      onClick={() =>
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
      }
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
    >
      ▶
    </button>
  </div>
</section>




      {/* ✅ Astrologers Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
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
                <p className="text-xs text-gray-500">{astro.city}, {astro.country}</p>
                <Link
                  to="/login"
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

      <PanchangCard />

      {/* ✅ Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-lg border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <img
                src={s.image}
                alt={s.title}
                className="h-66 w-66 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{s.desc}</p>
              {s.link && (
                <Link
                  to={s.link}
                  className="px-4 py-2 w-full bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm md:text-base"
                >
                  Go to {s.title}
                </Link>
              )}
              {s.chat && (
                <Link
                  to="/login"
                  className="px-4 py-2 w-full bg-purple-600 text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base mt-2"
                >
                  Chat Now
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
