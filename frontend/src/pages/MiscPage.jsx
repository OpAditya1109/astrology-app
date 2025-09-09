import React from "react";

export default function MiscPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
        Miscellaneous Collection
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Our miscellaneous spiritual products are coming soon! Stay tuned.
      </p>

      {/* Coming Soon Graphic / Icon */}
      <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
       <span className="text-6xl mb-4">🕉️</span> 
        <h2 className="text-2xl font-semibold text-gray-800">Coming Soon</h2>
        <p className="text-gray-500 mt-2 text-center">
          We are preparing our exclusive miscellaneous collection. It will be available shortly.
        </p>
      </div>
    </div>
  );
}
