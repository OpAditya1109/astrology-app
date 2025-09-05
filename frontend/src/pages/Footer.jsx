import React from "react";
import { useLocation, Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Branding */}
      <div>
  {/* Logo Section */}
  <div className="flex items-center space-x-3">
    <img
      src="/Bhavanaastro-logo.jpeg"
      alt="Astro Bhavana Logo"
      className="h-10 w-10 object-contain rounded-full border border-gray-300"
    />
    <h2 className="text-xl font-bold">Astro Bhavana</h2>
  </div>

  <p className="text-sm text-gray-400 mt-2">
    © {new Date().getFullYear()} All Rights Reserved.
  </p>
</div>



        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/shopping" className="hover:text-white text-gray-300">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white text-gray-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Corporate Info */}
       <div>
  <h3 className="font-semibold text-lg mb-3">Corporate Info</h3>
  <ul className="space-y-2 text-gray-300">
    <li>
      <Link to="/refund-cancellation" className="hover:text-white">
        Refund & Cancellation
      </Link>
    </li>
    <li>
      <Link to="/terms-conditions" className="hover:text-white">
        Terms & Conditions
      </Link>
    </li>
    <li>
      <Link to="/privacy-policy" className="hover:text-white">
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link to="/disclaimer" className="hover:text-white">
        Disclaimer
      </Link>
    </li>
    <li>
      <Link to="/pricing-policy" className="hover:text-white">
        Pricing Policy
      </Link>
    </li>
  </ul>
</div>


        {/* Secure Section */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Secure</h3>
          <ul className="space-y-2 text-gray-300">
            <li>🔒 Private & Confidential</li>
            <li>✅ Verified Astrologers</li>
            <li>💳 Secure Payment</li>
          </ul>
        </div>
      </div>

      {/* Contact Us */}
      <div className="container mx-auto px-6 mt-10 text-center md:text-left">
        <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
        <p className="text-gray-300">📧 bhavanaastro6@gmail.com</p>
      </div>

      {/* Social Media */}
      <div className="mt-10 flex space-x-5 justify-center">
        {/* Instagram */}
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3zm5 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12a10 10 0 10-11.5 9.95V14.9h-2.3V12h2.3v-2.2c0-2.3 1.37-3.6 3.47-3.6.7 0 1.43.12 1.43.12v2.3h-.8c-.8 0-1.05.5-1.05 1V12h2.5l-.4 2.9h-2.1v7.05A10 10 0 0022 12z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.6 3.2H4.4A3.4 3.4 0 001 6.6v10.8a3.4 3.4 0 003.4 3.4h15.2a3.4 3.4 0 003.4-3.4V6.6a3.4 3.4 0 00-3.4-3.4zM10 15.5v-7l6 3.5-6 3.5z" />
          </svg>
        </a>

        {/* Twitter (X) */}
         <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-6.574l-5.144-6.759-5.89 6.759H1.585l7.73-8.865L1.5 2.25h6.75l4.708 6.231 5.286-6.231zm-1.157 17.52h1.833L7.104 4.126H5.147z"/>
          </svg>
        </a>

        {/* Tumblr */}
        <a
          href="https://tumblr.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.7 20.5c-3.6 0-5.4-2.6-5.4-4.8V9H7V6.2c2.4-.9 3.2-3 3.5-4.2h2.8v3.9h3v3.1h-3v6.4c0 .7.4 1.7 1.6 1.7h1.5v3.4h-1.7z" />
          </svg>
        </a>

        {/* Blogger */}
        <a
          href="https://blogger.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.7 2H5.3C3.5 2 2 3.5 2 5.3v13.4C2 20.5 3.5 22 5.3 22h13.4c1.8 0 3.3-1.5 3.3-3.3V5.3C22 3.5 20.5 2 18.7 2zM12 18.2H8.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9H12c.5 0 .9.4.9.9s-.4.9-.9.9zm3.5-4.4h-7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9h7c.5 0 .9.4.9.9s-.4.9-.9.9z" />
          </svg>
        </a>

        {/* Medium */}
        <a
          href="https://medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2 7.5c0-.2 0-.4.2-.6l2-2.4V4h-4V5.4l1.6 2v9.2L0 19.8V21h6v-1.2L4 16.6v-7.2l6 12.6h1l6-12.6v7.2l-2 3.2V21h9v-1.2l-2-3.2v-9.2l2-2.4V4h-8v.5l2 2.4V13l-5 10.2L6 13V7.9l2-2.4V4H2v3.5z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  const location = useLocation();

  const hideFooterPaths = ["/chat", "/astrologer/chat", "/video-call", "/astrochat"];
  const hideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
