import { Link } from "react-router-dom";

export default function UserDashboard() {
  // ✅ Get logged-in user from sessionStorage
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ✅ Use name if available, else fallback
  const userName = user?.name || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for fixed navbar if using shared Navbar */}
      <div className="pt-20"></div>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6">
          Welcome, {userName}!
        </h2>
        <p className="text-gray-600 mb-8">
          Here’s your personalized dashboard where you can consult with astrologers, 
          check horoscopes, shop astrology products, and manage your wallet.
        </p>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Consult Card */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Consult Astrologers</h3>
            <p className="text-gray-500 mb-4">Book chat or call consultations with experts</p>
            <Link
              to="/user/consultancy"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Consult Now
            </Link>
          </div>

          {/* AI Astrologer */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">AI Astrologer</h3>
            <p className="text-gray-500 mb-4">Chat instantly with our AI-powered astrologer</p>
            <Link
              to="/astrochat"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Chat with AI
            </Link>
          </div>

          {/* Horoscope */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Horoscopes</h3>
            <p className="text-gray-500 mb-4">Check daily, weekly, and monthly horoscopes</p>
            <Link
              to="/user/horoscope"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              View Horoscopes
            </Link>
          </div>

          {/* Wallet */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Wallet</h3>
            <p className="text-gray-500 mb-4">Check balance, add funds, or redeem credits</p>
            <Link
              to="/user/wallet"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Wallet
            </Link>
          </div>

          {/* Shop */}
          <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Shop</h3>
            <p className="text-gray-500 mb-4">Browse astrology products and accessories</p>
            <Link
              to="/shopping"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Shop
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12 text-center text-gray-500">
        © {new Date().getFullYear()} AstroBhavana. All rights reserved.
      </footer>
    </div>
  );
}
