import React from "react";

import moneyMagnet from "../assets/product/Bracelets/money-magnet.webp";
import roseQuartz from "../assets/product/Bracelets/rose-quartz.webp";
import greenAventurine from "../assets/product/Bracelets/Green-Aventurine.jpg";
import amethyst from "../assets/product/Bracelets/Amethyst-Bracelet.jpg";
import sulemani from "../assets/product/Bracelets/Sulemani-Hakik.avif";
import clearQuartz from "../assets/product/Bracelets/Clear-Quartz.jfif";
import blackTourmaline from "../assets/product/Bracelets/Black-Tourmaline.jpg";
import yellowTigerEye from "../assets/product/Bracelets/Yellow-TigerEye.jpg";



export default function BraceletPage() {
const products = [
  {
    name: "Natural Money Magnet Stone Bracelet",
    img: moneyMagnet,
    price: "₹599",
    desc: "Attracts wealth, prosperity, and abundance into your life.",
  },
  {
    name: "Natural Rose Quartz Bracelet",
    img: roseQuartz,
    price: "₹599",
    desc: "Stone of love, harmony, and emotional healing.",
  },
  {
    name: "Green Aventurine Bracelet",
    img: greenAventurine,
    price: "₹599",
    desc: "Known as the stone of luck and opportunity.",
  },
  {
    name: "Natural Amethyst Bracelet",
    img: amethyst,
    price: "₹599",
    desc: "Promotes peace, calm, and spiritual awareness.",
  },
  {
    name: "Natural Sulemani Hakik Bracelet",
    img: sulemani,
    price: "₹599",
    desc: "Protects from negativity and balances energy.",
  },
  {
    name: "Natural Clear Quartz (Spatic) Bracelet",
    img: clearQuartz,
    price: "₹599",
    desc: "Powerful healing stone, enhances clarity and focus.",
  },
  {
    name: "Natural Black Tourmaline Bracelet",
    img: blackTourmaline,
    price: "₹599",
    desc: "Strong protection stone against negative energies.",
  },
  {
    name: "Natural Yellow Tiger Eye Bracelet",
    img: yellowTigerEye,
    price: "₹599",
    desc: "Boosts confidence, courage, and decision making.",
  },
];


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
        {products.map((product, i) => (
          <div
            key={i}
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
            <p className="text-purple-700 font-bold mt-1">{product.price}</p>
            <button className="mt-3 bg-purple-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-800 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
