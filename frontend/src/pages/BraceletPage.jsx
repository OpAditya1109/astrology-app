import React from "react";
import { Link } from "react-router-dom"; 
import products from "../data/product";
import { Star } from "lucide-react"; // rating stars

export default function BraceletPage() {
  const braceletProducts = products.filter((p) => p.category === "bracelet");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-purple-50 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-800 drop-shadow-sm">
          Bracelets Collection
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Explore our exclusive range of spiritual and healing bracelets.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {braceletProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            {/* Product Image (Bigger) */}
            <Link to={`/product/${product.id}`}>
              <div className="relative w-full h-64 sm:h-72 md:h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110 active:scale-105"
                />
              </div>
            </Link>

            {/* Product Details */}
            <div className="p-4 flex flex-col items-center">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-1">
                {product.name}
              </h3>

              {/* Ratings */}
              <div className="flex items-center gap-1 text-yellow-500 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="sm:w-4 sm:h-4"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* View Button */}
              <div className="mt-4 w-full">
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full bg-black text-white text-xs sm:text-sm py-2 sm:py-2.5 rounded-lg hover:bg-purple-700 transition text-center"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
