import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At <span className="font-semibold">Astro Bhavana</span>, we value your
        trust and are committed to protecting your personal information. This
        Privacy Policy explains how we collect, use, and safeguard your data
        when you use our website and astrology services.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <span className="font-semibold">Personal Details:</span> Name, date of
          birth, time of birth, place of birth, gender, and contact details
          (email, phone number).
        </li>
        <li>
          <span className="font-semibold">Payment Information:</span> Billing
          address, payment transaction details (processed via secure gateways).
        </li>
        <li>
          <span className="font-semibold">Usage Data:</span> IP address,
          browser, device information, and browsing activity on our platform.
        </li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>To provide accurate astrology readings and reports.</li>
        <li>To process bookings, payments, and service delivery.</li>
        <li>
          To communicate with you regarding consultations, updates, or support.
        </li>
        <li>To improve website functionality, user experience, and services.</li>
        <li>
          To comply with legal requirements, fraud prevention, and security
          measures.
        </li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">3. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell, rent, or trade your personal information to third
        parties. However, we may share limited data with:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Trusted astrologers or consultants (only relevant birth details).</li>
        <li>Payment gateway providers for secure transactions.</li>
        <li>
          Legal authorities, if required by law, court order, or government
          regulation.
        </li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Protection & Security</h2>
      <p className="mb-4">
        We implement industry-standard encryption and security practices to
        protect your personal data. While we strive to safeguard your
        information, no online system can guarantee 100% security. You are
        encouraged to keep your login credentials confidential.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies & Tracking</h2>
      <p className="mb-4">
        Our website may use cookies and similar technologies to enhance user
        experience, analyze traffic, and remember preferences. You may disable
        cookies in your browser settings, but some features may not function
        properly.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Retention</h2>
      <p className="mb-4">
        We retain your personal data only as long as necessary for the purposes
        outlined in this policy, or as required by law. You may request deletion
        of your data by contacting us.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Your Rights</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Access the personal data we hold about you.</li>
        <li>Request corrections to inaccurate or incomplete information.</li>
        <li>Request deletion of your personal information.</li>
        <li>Withdraw consent for promotional emails at any time.</li>
      </ul>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">8. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to external websites. We are not
        responsible for the privacy practices or content of such third-party
        sites. Users are encouraged to review their privacy policies.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to Privacy Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. The revised policy
        will be posted on this page with the updated effective date. Continued
        use of our services after changes means you accept the new terms.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or how your data is
        handled, please contact us at: <br />
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
