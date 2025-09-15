import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // hamburger + close icons

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check login status
  useEffect(() => {
    const checkLogin = () => {
      const token = sessionStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (isLoggedIn) navigate("/user/dashboard");
    else navigate("/");
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Text */}
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
            {!isLoggedIn ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium">
                  Home
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-purple-700 font-medium">
                  Login
                </Link>
                <Link to="/user/register" className="text-gray-700 hover:text-purple-700 font-medium">
                  User Register
                </Link>
                <Link to="/astrologer/register" className="text-gray-700 hover:text-purple-700 font-medium">
                  Astrologer Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/user/wallet" className="text-gray-700 hover:text-purple-700 font-medium">
                  Wallet
                </Link>
                <button
                  onClick={handleLogout}
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

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-6 flex flex-col gap-4">
            {/* 🔹 Main Services Always Visible */}
            <Link to="/kundli" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Free Kundli
            </Link>
            <Link to="/horoscopes" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Daily Horoscope
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Consult Astrologers
            </Link>
            <Link to="/match-making" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Matchmaking
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/education" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>

            <hr className="my-2 border-gray-200" />

            {/* 🔹 Auth Links */}
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/user/register" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
                  User Register
                </Link>
                <Link to="/astrologer/register" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Astrologer Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/user/wallet" className="text-gray-700 hover:text-purple-700 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Wallet
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-600 font-medium text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="pt-20"></div>
    </>
  );
}
