import React from "react";

export default function Terms() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <p className="mb-4">
        Welcome to <span className="font-semibold">Astro Bhavana</span>. By
        accessing, browsing, or using our website and services, you agree to be
        bound by the following Terms & Conditions. Please read them carefully
        before using our platform.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By using this website, you agree to comply with all applicable laws and
        regulations. If you do not agree with these Terms, please do not use our
        services.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">2. Services Offered</h2>
      <p className="mb-4">
        Astro Bhavana provides online astrology consultations, horoscope
        reports, matchmaking, kundli, and related services. These services are
        intended for guidance purposes only and should not be considered as a
        substitute for professional advice in areas such as health, finance,
        legal, or psychological matters.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">3. User Responsibilities</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>You agree to provide accurate, current, and complete information.</li>
        <li>
          You must not misuse our website for fraudulent, illegal, or
          unauthorized activities.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your login
          credentials and account activity.
        </li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Payments & Pricing</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          All payments for services are to be made in advance through our secure
          payment gateway.
        </li>
        <li>
          Prices are subject to change without prior notice. However, once a
          booking is confirmed, the price at the time of purchase will be
          honored.
        </li>
        <li>
          Refunds and cancellations are governed by our{" "}
          <a href="/refund-policy" className="text-blue-600 underline">
            Refund & Cancellation Policy
          </a>
          .
        </li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
      <p className="mb-4">
        Astro Bhavana and its astrologers are not liable for any direct,
        indirect, incidental, or consequential damages that may result from the
        use of our services. All predictions, advice, and reports are based on
        astrological principles and should be treated as guidance, not absolute
        certainty.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
      <p className="mb-4">
        All content, logos, text, graphics, and reports available on this
        website are the intellectual property of Astro Bhavana and are protected
        under copyright laws. Unauthorized copying, distribution, or commercial
        use is strictly prohibited.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Termination of Services</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate access to our services if a
        user is found violating these Terms, engaging in fraudulent activity, or
        misusing the platform.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h2>
      <p className="mb-4">
        These Terms & Conditions shall be governed by and construed in
        accordance with the laws of India. Any disputes shall fall under the
        jurisdiction of courts in{" "}
        <span className="font-semibold">[Your City, India]</span>.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to Terms</h2>
      <p className="mb-4">
        Astro Bhavana reserves the right to update, modify, or revise these
        Terms & Conditions at any time without prior notice. Continued use of
        the website constitutes acceptance of such changes.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
      <p>
        If you have any questions regarding these Terms & Conditions, please
        contact us at: <br />
        📧{" "}
        <a
          href="mailto:contact@astrobhavana.com"
          className="text-blue-600 underline"
        >
          contact@astrobhavana.com
        </a>
        <br />
       
      </p>
    </div>
  );
}
