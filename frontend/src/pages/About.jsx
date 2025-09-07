import React from "react";
import astrologerImg from "../assets/astrologer.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 flex flex-col items-center justify-center text-center py-16 px-6 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          About <span className="text-orange-600">Astro Bhavana</span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-700">
          Guiding lives with the wisdom of astrology. Trusted by 25,000+ families
          across the globe.
        </p>
      </section>

      {/* About Content */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={astrologerImg}
            alt="Astrology Consultation"
            className="w-72 md:w-96 rounded-full shadow-xl"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            At <span className="font-semibold text-orange-600">Astro Bhavana</span>,
            we believe in empowering individuals with accurate astrological
            guidance and solutions. With a team of highly experienced and
            certified astrologers, we provide clarity in times of confusion and
            direction in times of uncertainty.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            From <strong>Kundli generation</strong> and <strong>daily horoscopes</strong> 
            to personalized <strong>matchmaking</strong> and live consultations, 
            our services are designed to bring ancient wisdom into modern life.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our vision is simple: to help people lead happier and more fulfilling
            lives by making astrology accessible, reliable, and affordable.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Our Mission & Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-gray-700">
            <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Trust</h3>
              <p>
                Providing transparent and authentic astrological guidance trusted
                by thousands worldwide.
              </p>
            </div>
            <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Accuracy</h3>
              <p>
                Combining traditional astrology with modern tools for precise
                predictions and solutions.
              </p>
            </div>
            <div className="p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="font-bold text-lg mb-2 text-orange-600">Support</h3>
              <p>
                Offering 24/7 support to ensure you get guidance whenever you need
                it most.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
