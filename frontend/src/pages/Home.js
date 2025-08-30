import { Link } from "react-router-dom";
import PanchangCard from "../components/Panchang";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-orange-500">Astro Bhavana</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get your personalized horoscope, Kundli, and connect with top astrologers online.
        </p>
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
      {/* Add button if link exists */}
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

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} AstroBhavana. All rights reserved.
      </footer>
    </div>
  );
}
