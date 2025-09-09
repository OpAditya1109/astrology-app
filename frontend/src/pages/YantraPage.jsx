import React from "react";

export default function YantraPage() {
  return (
    <div className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-yellow-800 text-center mb-4">
        Yantra Collection
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Our sacred Yantras are coming soon! Stay tuned for spiritual growth, protection, and energy.
      </p>

      {/* Coming Soon Graphic / Icon */}
      <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🕉️</span>
        <h2 className="text-2xl font-semibold text-gray-800">Coming Soon</h2>
        <p className="text-gray-500 mt-2 text-center">
          We are preparing our exclusive Yantra collection. It will be available shortly.
        </p>
      </div>
    </div>
  );
}
