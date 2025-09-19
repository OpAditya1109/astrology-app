import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import astrologerImg from "../assets/astrologerm.png";
import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Import images for each service
import kundliImg from "../assets/kundli.png";
import horoscopeImg from "../assets/horoscope.png";
import consultImg from "../assets/consult.png";
import matchmakingImg from "../assets/matchmaking.png";
import shopImg from "../assets/shop.png";
import courseImg from "../assets/course.png";

export default function Home() {
  const [astrologers, setAstrologers] = useState([]);

  const services = [
    {
      title: "Free Kundli",
      desc: "Generate your Janam Kundli instantly",
      image: kundliImg,
      link: "/kundli",
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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-md shadow-md flex flex-col md:flex-row items-center justify-center text-center p-4 md:p-8">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={astrologerImg}
            alt="Astrologer"
            className="w-48 md:w-64 lg:w-72 rounded-full"
          />
        </div>

        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            <span className="text-orange-600">Astro Bhavana</span> – Trusted by{" "}
            <span className="text-black">25,000+ Families</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-700 mt-2 mb-4">
            Chat with our top astrologers for guidance and solutions.
          </p>
          <Link
            to="/login"
            className="px-6 py-2 md:px-8 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md text-base md:text-lg"
          >
            Chat Now
          </Link>
        </div>
      </section>

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

      {/* ✅ Astrologers Section */}
 

      {/* Services Section */}
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
