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

      {/* Sort / Filter */}
      <div className="flex justify-end mb-6 max-w-7xl mx-auto">
        <select className="border rounded-lg px-3 py-2 text-sm shadow-sm w-full sm:w-auto">
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {braceletProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 group"
          >
            {/* Discount Badge */}
            {product.oldPrice && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100
                )}
                % OFF
              </span>
            )}

       <Link to={`/product/${product.id}`}>
  <div className="relative w-full h-48 sm:h-56 md:h-60 bg-gray-100 flex items-center justify-center overflow-hidden">
    <img
      src={product.img}
      alt={product.name}
      className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-110 active:scale-105"
    />
  </div>
</Link>


            {/* Details */}
            <div className="p-3 sm:p-4 flex flex-col items-center">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-1">
                {product.name}
              </h3>

              {/* Ratings */}
              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="sm:w-4 sm:h-4" fill="currentColor" />
                ))}
              </div>

              {/* Price */}
              <div className="mt-2 flex items-center gap-2">
                {product.oldPrice && (
                  <span className="text-gray-400 line-through text-xs sm:text-sm">
                    ₹{product.oldPrice}
                  </span>
                )}
                <span className="text-purple-700 font-bold text-base sm:text-lg">
                  ₹{product.price}
                </span>
              </div>

              {/* View Button Only */}
              <div className="mt-4 w-full">
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full bg-purple-600 text-white text-xs sm:text-sm py-2 sm:py-2.5 rounded-lg hover:bg-purple-700 transition text-center"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
