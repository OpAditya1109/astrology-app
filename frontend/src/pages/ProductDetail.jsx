import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Truck, RotateCcw } from "lucide-react";
import products from "../data/product";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [mainImg, setMainImg] = useState(product?.img);
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  const commonFaqs = [
    {
      question: "What is the return policy and estimated delivery duration?",
      answer:
        "We offer a hassle-free 7-day return policy. Additionally, you can expect delivery within 10 to 14 days.",
    },
    {
      question: "How is this energized and how can I wear it?",
      answer:
        "All healing crystals correspond to different planets in our solar system, which is why each crystal vibrates at its unique frequency. These healing stones offer more than mere aesthetic value. At the right frequency, the crystals directly affect the 7 chakras of the human body.",
    },
    {
      question: "What is energisation?",
      answer:
        "When properly energised, the crystals vibrate at frequencies that align with the various chakras in our body. This enhances their therapeutic and psychic benefits.",
    },
    {
      question: "How we help?",
      answer:
        "At Astro Bhavana, we ensure all healing stones are sourced and energised by trusted experts and astrologers. Before delivery, they are energised with pure intentions to maximize effectiveness.",
    },
  ];

  const tabs = [
    { key: "description", label: "Description" },
    { key: "benefits", label: "Benefits" },
    { key: "howToWear", label: "How to Wear" },
    { key: "bestDay", label: "Best Day to Wear" },
    { key: "faq", label: "FAQs" },
  ];

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black transition text-sm sm:text-base"
        >
          ← Back to Collection
        </button>
      </div>

      {/* Product Container */}
      <div className="max-w-7xl mx-auto rounded-2xl shadow-lg p-5 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 bg-white">
        {/* Left: Images */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-full bg-gray-100 rounded-2xl">
            <img
              src={mainImg}
              alt={product.name}
              className="rounded-2xl shadow-lg max-h-[400px] sm:max-h-[900px] object-contain"
            />
          </div>
          <div className="flex gap-3 sm:gap-6 mt-4 sm:mt-8 overflow-x-auto justify-center">
            {[product.img, ...(product.images || [])].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name}-${i}`}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl cursor-pointer border-2 transition ${
                  mainImg === img ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            {product.name}
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-lg">
            ★ 4.9 | 1300+ Reviews
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
            <span className="text-2xl sm:text-4xl font-bold text-black">
              {product.price}
            </span>
            <span className="text-gray-400 line-through text-lg sm:text-2xl">
              {product.oldPrice}
            </span>
            <span className="text-green-600 font-semibold text-base sm:text-xl">
              {product.offer}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleBuyNow}
            className="mt-6 sm:mt-8 w-full bg-black text-white py-3 sm:py-5 rounded-xl text-lg sm:text-xl font-semibold hover:bg-gray-900 transition shadow-lg"
          >
            Buy Now
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-8 sm:mt-10 text-gray-700 text-sm sm:text-base">
            <div className="flex items-center gap-2 sm:gap-3 border rounded-xl p-3 sm:p-4">
              <Shield size={20} className="sm:w-5 sm:h-5" />{" "}
              <span>100% Genuine Stones</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border rounded-xl p-3 sm:p-4">
              <Truck size={20} className="sm:w-5 sm:h-5" />{" "}
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 border rounded-xl p-3 sm:p-4">
              <RotateCcw size={20} className="sm:w-5 sm:h-5" />{" "}
              <span>7-Day Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 rounded-2xl shadow-lg p-5 sm:p-10 bg-white">
        <div className="mb-6 sm:mb-8 flex gap-4 sm:gap-8 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 sm:pb-3 text-base sm:text-lg font-semibold transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4 sm:space-y-5 text-base sm:text-lg">
          {activeTab === "description" && <p>{product.description}</p>}

          {activeTab === "benefits" && (
            <ul className="list-disc list-inside space-y-2">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          {activeTab === "howToWear" && <p>{product.howToWear}</p>}

          {activeTab === "bestDay" && <p>{product.bestDay}</p>}

          {activeTab === "faq" && (
            <div className="space-y-3 sm:space-y-4">
              {product.faqs?.map((f, i) => (
                <details
                  key={`product-${i}`}
                  className="border rounded-lg p-4 cursor-pointer"
                >
                  <summary className="font-semibold">{f.question}</summary>
                  <p className="mt-2 text-gray-600">{f.answer}</p>
                </details>
              ))}

              {commonFaqs.map((f, i) => (
                <details
                  key={`common-${i}`}
                  className="border rounded-lg p-4 cursor-pointer"
                >
                  <summary className="font-semibold">{f.question}</summary>
                  <p className="mt-2 text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
