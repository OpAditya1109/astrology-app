import React from "react";

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <p className="mb-4">
        The information, guidance, and advice provided on{" "}
        <span className="font-semibold">Astro Bhavana</span> are based on
        traditional astrological principles, calculations, and the personal
        interpretations of our astrologers. Astrology is a subject of belief and
        interpretation, and results may vary from person to person.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        1. No Guarantee of Accuracy
      </h2>
      <p className="mb-4">
        While we strive to provide accurate predictions and reports, astrology
        should not be considered an exact science. The predictions and remedies
        are based on planetary positions, and outcomes may differ depending on
        multiple factors, including personal effort, environment, and
        circumstances.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. Not a Substitute for Professional Advice
      </h2>
      <p className="mb-4">
        The services and content on this website should not be treated as a
        substitute for professional services such as medical, legal, financial,
        or psychological advice. We strongly advise users to seek appropriate
        professional consultation for such matters.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        3. User Responsibility
      </h2>
      <p className="mb-4">
        Users are solely responsible for their actions and decisions based on
        the guidance received from our website or astrologers.{" "}
        <span className="font-semibold">Astro Bhavana</span> shall not be held
        liable for any direct, indirect, incidental, or consequential damages
        arising out of the use of our services.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        4. Payment & Refund Policy
      </h2>
      <p className="mb-4">
        All payments made for consultations, reports, or remedies are final and
        subject to our{" "}
        <a href="/refund-cancellation" className="text-blue-600 underline">
          Refund & Cancellation Policy
        </a>
        . Please review it carefully before making any purchases.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to third-party websites or applications.
        We are not responsible for the accuracy, reliability, or content of such
        external sites and disclaim any liability for their use.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Consent</h2>
      <p className="mb-4">
        By using this website and our services, you acknowledge and agree that
        you have read, understood, and accepted this Disclaimer, along with our{" "}
        <a href="/terms-conditions" className="text-blue-600 underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-blue-600 underline">
          Privacy Policy
        </a>
        .
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p>
        For any questions regarding this Disclaimer, please contact us: <br />
        📧{" "}
        <a
          href="mailto:bhavanaastro6@gmail.com"
          className="text-blue-600 underline"
        >
          bhavanaastro6@gmail.com
        </a>
        <br />
      
      </p>
    </div>
  );
}
