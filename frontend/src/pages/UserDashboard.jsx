import { Link } from "react-router-dom";
import consultImg from "../assets/consult.png";
import aiImg from "../assets/ai.png";
import horoscopeImg from "../assets/horoscope.png";
import walletImg from "../assets/wallet.png";
import shopImg from "../assets/shop.png";
import coursesImg from "../assets/course.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "User";

  const [astrologers, setAstrologers] = useState([]);
  const [aiAstrologers, setAiAstrologers] = useState([]);

  const services = [
    {
      title: "Consult Astrologers",
      desc: "Book chat or call consultations with experts",
      link: "/user/consultancy",
      image: consultImg,
      button: "Consult Now",
    },
    {
      title: "AI Astrologer",
      desc: "Chat instantly with our AI-powered astrologer",
      link: "/ai-consultancy",
      image: aiImg,
      button: "Chat with AI",
    },
    {
      title: "Horoscopes",
      desc: "Check daily, weekly, and monthly horoscopes",
      link: "/user/horoscope",
      image: horoscopeImg,
      button: "View Horoscopes",
    },
    {
      title: "Wallet",
      desc: "Check balance, add funds, or redeem credits",
      link: "/user/wallet",
      image: walletImg,
      button: "Go to Wallet",
    },
    {
      title: "Shop",
      desc: "Browse astrology products and accessories",
      link: "/shopping",
      image: shopImg,
      button: "Go to Shop",
    },
    {
      title: "Courses",
      desc: "Learn astrology, Reiki, Vastu, and more",
      link: "/occult",
      image: coursesImg,
      button: "Explore Courses",
    },
  ];

  // ✅ Fetch real astrologers and AI astrologers separately
  // ✅ Fetch real astrologers and AI astrologers separately
 useEffect(() => {
  const fetchAstrologers = async () => {
    try {
      const res = await axios.get("https://bhavanaastro.onrender.com/api/Consult-astrologers?limit=20");
      const allAstrologers = res.data.astrologers || [];

      // Separate based on isAI flag
      const real = allAstrologers.filter((a) => !a.isAI);
      const ai = allAstrologers.filter((a) => a.isAI);

      setAstrologers(real);
      setAiAstrologers(ai);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    }
  };
  fetchAstrologers();
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20"></div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6">
          Welcome, {userName}!
        </h2>
        <p className="text-gray-600 mb-8">
          Here’s your personalized dashboard where you can consult with astrologers,
          check horoscopes, shop astrology products, explore courses, and manage your wallet.
        </p>

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
        {/* 📦 Dashboard Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition flex flex-col"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-66 w-66 object-cover mb-4"
              />
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 mb-4 flex-grow">{service.desc}</p>
              <Link
                to={service.link}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {service.button}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
