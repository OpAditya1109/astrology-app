import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import astrologerImg from "../assets/astrologerm.png";

// Heroicons
import { DocumentIcon, CalendarIcon, ChatBubbleLeftRightIcon, HeartIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const services = [
    {
      title: "Free Kundli",
      desc: "Generate your Janam Kundli instantly",
      icon: DocumentIcon,
      link: "/kundli",
    },
    {
      title: "Horoscopes",
      desc: "Daily horoscopes",
      icon: CalendarIcon,
      link: "/horoscopes",
    },
    {
      title: "Consult Astrologers",
      desc: "Chat or call expert astrologers",
      icon: ChatBubbleLeftRightIcon,
      chat: true,
    },
    {
      title: "Matchmaking",
      desc: "Check Kundli compatibility",
      icon: HeartIcon,
      link: "/match-making",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

   
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



      <PanchangCard />

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
          Our Services
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-lg border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full p-4 mb-4 inline-flex items-center justify-center">
                <s.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.title}</h3>
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
