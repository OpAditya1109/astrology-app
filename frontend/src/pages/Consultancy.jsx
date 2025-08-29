import { useState } from "react";

export default function Consultancy() {
  const [activeTab, setActiveTab] = useState("Love");

  const categories = [
    "Love",
    "Career",
    "Marriage",
    "Health",
    "Business",
    "Education",
    "Pregnancy",
    "Legal",
  ];

  const content = {
    Love: "Get insights into your love life, relationships, and compatibility.",
    Career: "Find guidance about career growth, job changes, and opportunities.",
    Marriage: "Know about marriage timing, partner compatibility, and stability.",
    Health: "Astrological remedies and predictions for better health.",
    Business: "Business success, partnerships, investments, and profits.",
    Education: "Educational success, study choices, and overseas opportunities.",
    Pregnancy: "Astrological predictions and remedies related to childbirth.",
    Legal: "Get astrological help for legal issues and disputes.",
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-purple-800 mb-4">
        Astrology Consultancy
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-10">
        Book consultations with expert astrologers. Choose your astrologer and
        get guidance on career, marriage, finance, and more.
      </p>

      {/* Tabs */}
      <div className="w-full max-w-4xl">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === cat
                  ? "bg-purple-600 text-white shadow"
                  : "bg-white text-gray-700 border hover:bg-purple-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3">
            {activeTab} Consultancy
          </h2>
          <p className="text-gray-600">{content[activeTab]}</p>
          <button className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
