import { Link } from "react-router-dom";

export default function Shopping() {
  const categories = [
    { name: "Bracelet", img: "/shop/bracelet.png", link: "/shop/bracelet" },
    { name: "Mala", img: "/shop/mala.png", link: "/shop/mala" },
    { name: "Gemstone", img: "/shop/gemstone.png", link: "/shop/gemstone" },
    { name: "Rudraksha", img: "/shop/rudraksha.png", link: "/shop/rudraksha" },
    // Later you can re-enable Yantra & Miscellaneous
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-purple-50 p-8">
      <h1 className="text-5xl font-extrabold text-purple-900 text-center mb-4 drop-shadow-sm">
        Astrology Shop
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl text-center mx-auto mb-12">
        Explore authentic gemstones, sacred Rudraksha, mystical Yantras, and astrology remedies to bring positivity into your life.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-5xl mx-auto justify-items-center">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={cat.link}
            className="group flex flex-col items-center"
          >
            <div className="w-56 h-56 bg-white shadow-lg rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-purple-400 group-hover:shadow-2xl transform group-hover:-translate-y-2 transition duration-300">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition text-center">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
