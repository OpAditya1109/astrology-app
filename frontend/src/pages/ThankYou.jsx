import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thank You for Registering! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your registration has been submitted successfully.  
          Our team will verify your details, and you will be notified once your account is approved.
        </p>

        <div className="flex justify-center gap-4">
          {/* Go Home */}
          <Link
            to="/"
            className="px-5 py-2 rounded-xl bg-orange-500 text-white font-medium shadow hover:bg-orange-600 transition"
          >
            Go to Home
          </Link>

          {/* Contact Us (mailto link with subject) */}
          <a
            href="mailto:contact@astrobhavana.com?subject=Astrologer%20Registration%20Support"
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
