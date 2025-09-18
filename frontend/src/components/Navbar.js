import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../Context/AuthContext"; // ✅ import

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useAuth(); // ✅ from context
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (token) {
      if (role === "user") navigate("/user/dashboard");
      else if (role === "astrologer") navigate("/astrologer/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <span
            onClick={handleLogoClick}
            className="cursor-pointer flex items-center gap-2"
          >
            <img
              src="/Bhavanaastro-logo.jpeg"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-orange-500">
              Astro Bhavana
            </span>
          </span>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {!token ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium">Home</Link>
                <Link to="/login" className="text-gray-700 hover:text-purple-700 font-medium">Login</Link>
                <Link to="/user/register" className="text-gray-700 hover:text-purple-700 font-medium">User Register</Link>
                <Link to="/astrologer/register" className="text-gray-700 hover:text-purple-700 font-medium">Astrologer Register</Link>
              </>
            ) : (
              <>
                <Link to="/user/wallet" className="text-gray-700 hover:text-purple-700 font-medium">Wallet</Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="text-gray-700 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-6 flex flex-col gap-4">
            <Link to="/kundli" onClick={() => setIsMenuOpen(false)}>Free Kundli</Link>
            <Link to="/horoscopes" onClick={() => setIsMenuOpen(false)}>Daily Horoscope</Link>
            <Link to="/match-making" onClick={() => setIsMenuOpen(false)}>Matchmaking</Link>
            <Link to="/shopping" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/occult" onClick={() => setIsMenuOpen(false)}>Courses</Link>
            <hr className="my-2 border-gray-200" />

            {!token ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/user/register" onClick={() => setIsMenuOpen(false)}>User Register</Link>
                <Link to="/astrologer/register" onClick={() => setIsMenuOpen(false)}>Astrologer Register</Link>
              </>
            ) : (
              <>
                <Link to="/user/wallet" onClick={() => setIsMenuOpen(false)}>Wallet</Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="text-left text-gray-700 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
      <div className="pt-20"></div>
    </>
  );
}
