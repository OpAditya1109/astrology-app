export default function Shopping() {
  const categories = [
  
    { name: "Rudraksha", img: "/shop/rudraksha.png" },
    { name: "Yantra", img: "/shop/yantra.png" },
    { name: "Gemstone", img: "/shop/gemstone.png" },
    { name: "Mala", img: "/shop/mala.png" },

    { name: "Miscellaneous", img: "/shop/misc.png" },
    { name: "Bracelet", img: "/shop/bracelet.png" },
    { name: "Premium", img: "/shop/premium.png" },
    { name: "Pendant", img: "/shop/pendant.png" },
 
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-purple-800 text-center mb-4">
        Astrology Shop
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mx-auto mb-8">
        Explore gemstones, Rudraksha, Yantras, and astrology remedies from trusted sources.
      </p>

      {/* Grid of Categories */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
          >
            {/* Round Image */}
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={cat.img} alt={cat.name} className="w-60 h-60 object-cover" />
            </div>
            {/* Label */}
            <p className="mt-2 text-sm font-medium text-gray-700 text-center">
              {cat.name}
            </p>
          </div>
        ))}
      </div>

      {/* Banner (like in screenshot) */}
     
    </div>
  );
}
