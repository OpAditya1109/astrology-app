import React from "react";
import { motion } from "framer-motion";

export default function ConsultationPage() {
  return (
    <div className="consultation-page bg-gradient-to-b from-white via-yellow-50 to-white text-gray-800">
{/* Hero Section */}
<section className="flex flex-col-reverse md:flex-row items-center justify-between py-16 px-6 max-w-[1400px] mx-auto text-center md:text-left">
  {/* Left Content */}
  <div className="md:w-[45%]">
    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
      Clarity That Transforms — Speak with Astrologer{" "}
      <span className="text-yellow-600">Madhav Yadav</span>
    </h1>
    <h2 className="mt-4 text-lg md:text-2xl text-gray-700 font-medium">
      Experience deep insight, calm direction, and karmic healing in one call.
    </h2>

    <p className="mt-6 text-2xl font-semibold text-yellow-700">
      Starting at ₹1,00,000/-
    </p>
    <p className="text-gray-500 italic">100% Confidential | Transformative Guidance</p>

    <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition">
        Book Audio Consultation
      </button>
      <button className="border border-yellow-600 text-yellow-700 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition">
        In-Person Consultation
      </button>
    </div>
  </div>

  {/* Right Image */}
  <div className="md:w-[55%] flex justify-center mb-10 md:mb-0">
    <img
      src="/Madhav-Yadav3.png"
      alt="Astrologer Madhav Yadav"
      className="rounded-2xl shadow-2xl w-[95%] md:w-[720px] lg:w-[880px] xl:w-[950px] transition-transform hover:scale-[1.02]"
    />
  </div>
</section>



{/* Stats Section */}
<section className="py-16 bg-white border-t border-b border-yellow-100">
  <div className="grid grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto text-center gap-6 px-6">
    {[
      { text: "35+ Years of Practice", delay: 0 },
      { text: "Clients in 15+ Countries", delay: 0.2 },
      { text: "15,000+ Consultations", delay: 0.4 },
      { text: "Recognized Astrology Expert", delay: 0.6 },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: item.delay }}
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-b from-yellow-50 to-white border border-yellow-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <h3 className="text-xl font-bold text-yellow-700 drop-shadow-sm">
          {item.text}
        </h3>
        <div className="mt-2 h-[3px] w-12 mx-auto bg-yellow-500 rounded-full transition-all duration-300 group-hover:w-16"></div>
      </motion.div>
    ))}
  </div>
</section>
   

      {/* Categories Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Find the Root Cause of Your Life’s Patterns
        </h2>
        <p className="text-gray-600 mt-2 mb-10">
          Discover where your energy is blocked and how to realign with your purpose.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Career & Growth",
              img: "/Career.jpg", // 🔮 Gemini prompt below
              list: [
                "Feeling stuck or unrecognized at work?",
                "Unsure if your career is aligned with destiny?",
                "Want to know when your luck will turn?",
              ],
            },
            {
              title: "Love & Compatibility",
              img: "/LoveandRelation.jpg",
              list: [
                "Struggling with understanding your partner?",
                "Delays or issues in marriage?",
                "Want to attract meaningful relationships?",
              ],
            },
            {
              title: "Wealth & Stability",
              img: "/Money.png",
              list: [
                "Earning well but never saving enough?",
                "Money comes and goes unpredictably?",
                "Find the right time to invest or start business?",
              ],
            },
            {
              title: "Health & Energy",
              img: "/peace.jpg",
              list: [
                "Facing recurring health issues?",
                "Emotional fatigue or anxiety cycles?",
                "Learn remedies for long-term wellness.",
              ],
            },
          ].map((cat, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg transition text-left"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h4 className="text-xl font-semibold text-yellow-700 mb-3">
                {cat.title}
              </h4>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                {cat.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="max-w-3xl mx-auto mt-10 text-gray-700">
          When you understand the deeper reasons behind your struggles, real change begins.  
          Let’s uncover the truth behind your journey and redirect your destiny.
        </p>
        <button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition">
          Book a Session
        </button>
      </section>

  {/* Services Section */}
<section className="py-16 bg-yellow-50 text-center">
  <h2 className="text-3xl font-bold text-gray-900">
    Select Your Consultation Type
  </h2>
  <p className="text-gray-600 mt-2 mb-6">
    Whether you seek clarity for yourself or your relationship, there’s a session for you.
  </p>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
    {[
      {
        title: "Personal Consultation",
        desc: "Get deep insights into career, health, and personal life.",
        price: 148000 * 0.75, // 25% discount
      },
      {
        title: "Couple Consultation",
        desc: "Decode compatibility and relationship karma.",
        price: 200000 * 0.75, // 25% discount
      },
      {
        title: "Face-to-Face Meeting",
        desc: "Exclusive 1-on-1 session with Madhav Yadav in Noida.",
        price: 500000 * 0.75, // 25% discount
      },
    ].map((s, i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 p-8 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
      >
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">{s.title}</h2>
        <p className="text-gray-600 mb-4">{s.desc}</p>
        <p className="text-lg font-semibold text-gray-800 mb-2">
          <strong>Price:</strong> ₹{s.price.toLocaleString("en-IN")}
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 mt-4 rounded-lg font-semibold transition">
          Book Now
        </button>
      </div>
    ))}
  </div>
</section>

      {/* Important Notes Section */}
<section className="py-16 bg-white text-center border-t border-yellow-100 px-6">
  <h2 className="text-3xl font-bold text-gray-900 mb-6">Important Notes</h2>
  <div className="max-w-4xl mx-auto text-gray-700 text-base leading-relaxed space-y-4">
    <p>
      Once your booking is confirmed, you’ll be assigned the next available consultation slot. 
      In case of rescheduling due to <strong>Pandit Ji’s busy schedule</strong>, your call will remain a 
      top priority, and you’ll be allotted the nearest possible time.
    </p>
    <p>
      Your consultation will be scheduled <strong>only after payment confirmation</strong>.  
      All available slots are currently <strong>booked till 1st December 2025</strong>.
    </p>
    <p className="text-yellow-700 font-medium">
      सभी कॉल पेमेंट के बाद ही शेड्यूल किये जायेंगे। सभी स्लॉट्स 1 दिसंबर 2025 तक बुक हैं।
    </p>
    <p className="italic text-gray-600">
      Note: This is a one-time consultation service. There is no refund policy once the session 
      is booked and the consultation has taken place.
    </p>
  </div>
</section>

{/* One-Time Service & Support Section */}
<section className="py-12 bg-yellow-50 text-center border-t border-yellow-200">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white border border-yellow-200 rounded-2xl shadow p-8 hover:shadow-lg transition">
      <h3 className="text-2xl font-bold text-yellow-700 mb-3">One-Time Service</h3>
      <p className="text-gray-700">
        Each consultation is a single, personalized session that provides deep astrological 
        insights based on your birth details and chosen service.
      </p>
    </div>

    <div className="bg-white border border-yellow-200 rounded-2xl shadow p-8 hover:shadow-lg transition">
      <h3 className="text-2xl font-bold text-yellow-700 mb-3">15 Days Support</h3>
      <p className="text-gray-700">
        Get <strong>15 days of dedicated post-consultation support</strong> to assist you with 
        remedies, follow-up questions, and continued astrological guidance.
      </p>
    </div>
  </div>
</section>

    </div>
  );
}
