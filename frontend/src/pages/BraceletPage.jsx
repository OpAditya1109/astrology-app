import React from "react";
import { Link } from "react-router-dom"; 
import products from "../data/product";

export default function BraceletPage() {
  const braceletProducts = products.filter((p) => p.category === "bracelet");

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-4">
        Bracelets Collection
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Explore our exclusive range of spiritual and healing bracelets.
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {braceletProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`} 
            className="relative bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition group"
          >
            {/* Image Container with Hover Description */}
            <div className="relative w-40 h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-center px-2 text-sm">
                {product.desc}
              </div>
            </div>

            {/* Product Details */}
            <h3 className="mt-3 text-sm font-semibold text-gray-800 text-center">
              {product.name}
            </h3>

            {/* Price Section */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-gray-500 line-through text-sm">
                {product.oldPrice}
              </span>
              <span className="text-purple-700 font-bold">{product.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
 