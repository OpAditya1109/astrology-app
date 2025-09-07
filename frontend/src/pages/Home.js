import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
import astrologerImg from "../assets/astrologer.png"; // put your uploaded image in src/assets

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Banner */}
<section className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 rounded-md shadow-md flex items-center p-6 md:p-8">
  
  {/* Astrologer Image */}
  <div className="flex-shrink-0 mr-6">
    <img
      src={astrologerImg}
      alt="Astrologer"
      className="w-28 md:w-36 lg:w-40"
    />
  </div>

  {/* Text + Button */}
  <div>
    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
      <span className="text-orange-600">Astro Bhavana</span> – Trusted by{" "}
      <span className="text-black">25,000+ Families</span>
    </h2>
    <p className="text-base md:text-lg text-gray-700 mt-2 mb-4">
      Chat with our top astrologers for guidance and solutions.
    </p>
    <Link
      to="/chat"
      className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md inline-block"
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
