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
  // ✅ Get logged-in user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
const [astrologers, setAstrologers] = useState([]);
  // ✅ Use name if available, else fallback
  const userName = user?.name || "User";

  // ✅ Service cards data (easier to map)
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
    link: "/astrochat",
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for fixed navbar if using shared Navbar */}
      <div className="pt-20"></div>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6">
          Welcome, {userName}!
        </h2>
        <p className="text-gray-600 mb-8">
          Here’s your personalized dashboard where you can consult with astrologers, 
          check horoscopes, shop astrology products, explore courses, and manage your wallet.
        </p>
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
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
