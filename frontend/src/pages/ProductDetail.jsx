import React, { useState } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import { Shield, Truck, RotateCcw, Gift } from "lucide-react";
import products from "../data/product";


export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [mainImg, setMainImg] = useState(product?.img);
  const [activeTab, setActiveTab] = useState("description"); // Default tab
  const navigate = useNavigate();
  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  // Common FAQs for all products
  const commonFaqs = [
    {
      question: "What is the return policy and estimated delivery duration?",
      answer:
        "We offer a hassle-free 7-day return policy. Additionally, you can expect delivery within 10 to 14 days.",
    },
    {
      question: "How is this energized and how can I wear it?",
      answer:
        "How can crystals heal: All healing crystals correspond to different planets in our solar system, which is why each crystal vibrates at its unique frequency. These healing stones offer more than mere aesthetic value. At the right frequency, the crystals directly affect the 7 chakras of the human body.",
    },
    {
      question: "What is energisation?",
      answer:
        "When properly energised, the crystals vibrate at frequencies that align with the various chakras in our body. This process of ensuring the alignment of frequencies, known as the energization of a healing stone, enhances their therapeutic and psychic benefits.",
    },
    {
      question: "How we help?",
      answer:
        "At Astro Bhavana, we ensure that all our healing stones are sourced and energised by trusted experts and astrologers to guarantee their authenticity. Before delivery, all our healing stones are energised with pure intentions and energy by our esteemed astrologers, making them highly effective for our customers.",
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
    // Navigate to checkout page with productId
    navigate(`/checkout/${product.id}`);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-black transition text-sm"
        >
          ← Back to Collection
        </Link>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Product Images */}
        <div>
          <img
            src={mainImg}
            alt={product.name}
            className="rounded-xl shadow-md w-full max-h-[500px] object-contain bg-gray-100"
          />
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {[product.img, ...(product.images || [])].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name}-${i}`}
                onClick={() => setMainImg(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border transition ${
                  mainImg === img ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 mt-1 text-sm">★ 4.9 | 1300+ Reviews</p>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-semibold text-black">
              {product.price}
            </span>
            <span className="text-gray-400 line-through text-lg">
              {product.oldPrice}
            </span>
            <span className="text-green-600 font-medium">{product.offer}</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleBuyNow}
            className="mt-6 w-full bg-black text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-900 transition shadow-md"
          >
            Buy Now
          </button>
          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-8 text-gray-700 text-sm">
            <div className="flex items-center gap-2 border rounded-lg p-3">
              <Shield size={18} /> <span>100% Genuine Stones</span>
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-3">
              <Truck size={18} /> <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 border rounded-lg p-3">
              <RotateCcw size={18} /> <span>7-Day Easy Returns</span>
            </div>
           
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-2xl shadow-sm p-8">
        <div className="mb-6 flex gap-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 font-medium transition ${
                activeTab === tab.key
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4">
          {activeTab === "description" && <p>{product.description}</p>}

          {activeTab === "benefits" && (
            <ul className="list-disc list-inside space-y-1">
              {product.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          {activeTab === "howToWear" && <p>{product.howToWear}</p>}

          {activeTab === "bestDay" && <p>{product.bestDay}</p>}

          {activeTab === "faq" && (
            <div className="space-y-3">
              {/* Product-specific FAQs */}
              {product.faqs?.map((f, i) => (
                <details
                  key={`product-${i}`}
                  className="border rounded-lg p-4 cursor-pointer"
                >
                  <summary className="font-medium">{f.question}</summary>
                  <p className="mt-2 text-gray-600">{f.answer}</p>
                </details>
              ))}

              {/* Common FAQs */}
              {commonFaqs.map((f, i) => (
                <details
                  key={`common-${i}`}
                  className="border rounded-lg p-4 cursor-pointer"
                >
                  <summary className="font-medium">{f.question}</summary>
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
