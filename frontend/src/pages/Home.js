import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import astrologerImg from "../assets/astrologer.png"; // put your uploaded image in src/assets

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Banner */}
<section className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-md shadow-md flex flex-col md:flex-row items-center p-2 md:p-4">
  {/* Astrologer Image */}
  <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-4">
    <img
      src={astrologerImg}
      alt="Astrologer"
      className="w-40 sm:w-36 md:w-56 lg:w-64 rounded-full"
    /> 
  </div>

  {/* Text + Button */}
  <div className="text-center md:text-left">
    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
      <span className="text-orange-600">Astro Bhavana</span> – Trusted by{" "}
      <span className="text-black">25,000+ Families</span>
    </h2>
    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mt-1 mb-2">
      Chat with our top astrologers for guidance and solutions.
    </p>
    <Link
      to="/login"
      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md inline-block text-sm sm:text-base md:text-lg"
    >
      Chat Now
    </Link>
  </div>
</section>






      <PanchangCard />

      {/* Services */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">
          🔥 Popular Astrology Services
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { title: "Free Kundli", desc: "Generate your Janam Kundli instantly" },
            { title: "Horoscopes", desc: "Daily, Weekly & Monthly horoscopes" },
            { title: "Consult Astrologers", desc: "Chat or call expert astrologers" },
            { title: "Matchmaking", desc: "Check Kundli compatibility", link: "/match-making" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-purple-700 mb-2">{s.title}</h3>
              <p className="text-gray-500 mb-4">{s.desc}</p>
              {s.link && (
                <Link
                  to={s.link}
                  className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Go to {s.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
