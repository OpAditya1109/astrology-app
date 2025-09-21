import { Link } from "react-router-dom";

export default function Shopping() {
  const categories = [
    { name: "Bracelet", img: "/shop/bracelet.png", link: "/shop/bracelet" },
    { name: "Mala", img: "/shop/mala.png", link: "/shop/mala" },
    { name: "Gemstone", img: "/shop/gemstone.png", link: "/shop/gemstone" },
    { name: "Rudraksha", img: "/shop/rudraksha.png", link: "/shop/rudraksha" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-900 text-center mb-4 drop-shadow-sm">
        Astrology Shop
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl text-center mx-auto mb-10 md:mb-12">
        Explore authentic gemstones, sacred Rudraksha, mystical Yantras, and astrology remedies to bring positivity into your life.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto justify-items-center">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={cat.link}
            className="group flex flex-col items-center w-full"
          >
            <div className="w-60 h-60 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-white shadow-lg rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-purple-400 group-hover:shadow-2xl transform group-hover:-translate-y-2 transition duration-300">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition text-center">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
