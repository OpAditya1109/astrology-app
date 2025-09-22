import React from "react";
import { Link } from "react-router-dom";
import products from "../data/product";
import { Star } from "lucide-react"; // rating stars

export default function MalaPage() {
  // Filter only Mala products
  const malaProducts = products.filter((p) => p.category === "mala");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-800 drop-shadow-sm">
          Mala Collection
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Explore our sacred mala beads for meditation and spiritual growth.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {malaProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 group w-full min-w-[320px]"
          >
            {/* Product Image with Zoom */}
             {/* Product Image */}
                      <Link to={`/product/${product.id}`}>
                        <div className="relative w-full h-[350px] bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover transform transition-transform duration-700 ease-in-out group-hover:scale-105 active:scale-100"
                          />
                        </div>
                      </Link>
          

            {/* Product Details */}
           <div className="p-4 flex flex-col items-center">
             <h3 className="text-base font-medium text-gray-800 text-center line-clamp-1">
               {product.name}
             </h3>
           
             {/* Ratings */}
             <div className="flex items-center gap-1 text-yellow-500 mt-2">
               {[...Array(5)].map((_, i) => (
                 <Star
                   key={i}
                   size={16}
                   className="sm:w-4 sm:h-4"
                   fill="currentColor"
                 />
               ))}
             </div>
           
             {/* View Button */}
             <div className="mt-4 w-full">
               <Link
                 to={`/product/${product.id}`}
                 className="block w-full bg-black text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition text-center"
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
