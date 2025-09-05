import React from "react";

export default function PricingPolicy() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Pricing Policy</h1>

      <p className="mb-4">
        At <span className="font-semibold">Astro Bhavana</span>, we believe in
        transparent and fair pricing for all our astrology services. This policy
        outlines how we determine, display, and manage pricing for
        consultations, reports, remedies, and other services offered on our
        platform.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Service Charges</h2>
      <p className="mb-4">
        All prices for consultations, reports, and remedies are clearly
        mentioned on the website or app. Charges may vary depending on the type
        of service, duration of consultation, and the expertise of the
        astrologer.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        2. Currency & Payment Modes
      </h2>
      <ul className="list-disc list-inside space-y-2">
        <li>All prices are listed in Indian Rupees (₹), unless specified.</li>
        <li>
          We accept multiple payment methods including credit/debit cards, UPI,
          net banking, and digital wallets.
        </li>
        <li>
          Payments are processed through secure third-party payment gateways.
        </li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">3. Taxes</h2>
      <p className="mb-4">
        All applicable taxes, including GST (Goods and Services Tax), are
        included in the price unless otherwise mentioned. A tax invoice will be
        generated and shared with the customer for each successful transaction.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Price Changes</h2>
      <p className="mb-4">
        Astro Bhavana reserves the right to revise prices for any service at any
        time without prior notice. However, once a booking or consultation is
        confirmed, the price at the time of purchase will be honored.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        5. Discounts & Offers
      </h2>
      <p className="mb-4">
        We may provide promotional offers, discounts, or coupons from time to
        time. These are subject to specific terms and validity periods. Offers
        cannot be combined unless explicitly mentioned.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Refunds</h2>
      <p className="mb-4">
        Payments once made are non-refundable except as outlined in our{" "}
        <a href="/refund-policy" className="text-blue-600 underline">
          Refund & Cancellation Policy
        </a>
        .
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Mispricing</h2>
      <p className="mb-4">
        In the rare event of an incorrect price being displayed due to
        technical, typographical, or system errors, Astro Bhavana reserves the
        right to cancel the order. Any amount paid in such cases will be
        refunded as per our policies.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
      <p>
        For any questions related to pricing, payments, or billing, please
        contact us: <br />
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
