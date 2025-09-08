import { Link } from "react-router-dom";

export default function Shopping() {
  const categories = [
    { name: "Bracelet", img: "/shop/bracelet.png", link: "/shop/bracelet" },
    { name: "Mala", img: "/shop/mala.png", link: "/shop/mala" },
    { name: "Gemstone", img: "/shop/gemstone.png", link: "/shop/gemstone" },
    { name: "Rudraksha", img: "/shop/rudraksha.png", link: "/shop/rudraksha" },
    { name: "Yantra", img: "/shop/yantra.png", link: "/shop/yantra" },
    { name: "Miscellaneous", img: "/shop/misc.png", link: "/shop/misc" },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-4xl font-bold text-purple-800 text-center mb-4">
        Astrology Shop
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mx-auto mb-8">
        Explore gemstones, Rudraksha, Yantras, and astrology remedies from trusted sources.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={cat.link}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
          >
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 text-center">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
