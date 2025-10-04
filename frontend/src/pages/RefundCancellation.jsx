import React from "react";

export default function RefundCancellation() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
      <p className="mb-4">
        At <span className="font-semibold">Astro Bhavana</span>, we are committed
        to providing the best possible services and products to our valued
        customers. Since most of our offerings are digital, time-bound, and
        personalized, we follow a transparent Refund & Cancellation Policy to
        avoid any confusion.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">1. General Policy</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          All payments made for services and digital products on this website are
          considered final.
        </li>
        <li>
          Refunds are provided only in exceptional cases, such as double
          payments, failed transactions, or non-delivery of services/products
          due to technical reasons.
        </li>
        <li>
          We do not offer refunds for change of mind, dissatisfaction with
          astrologer predictions, or personal disagreements with the guidance
          provided.
        </li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">2. Consultation Services</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Once a session (chat, call, or video consultation) is booked and
          payment is confirmed, it cannot be cancelled by the user.
        </li>
        <li>
          If the astrologer is unavailable at the booked time, the session will
          be rescheduled at a mutually convenient time or refunded, based on
          customer preference.
        </li>
        <li>
          If a session is interrupted due to technical issues (internet failure,
          app crash, etc.), our support team will verify the issue and arrange a
          reschedule. Refunds will only be processed in rare cases where the
          service could not be delivered at all.
        </li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">3. Digital Products</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          All horoscope reports, birth charts, kundli, and matchmaking reports
          are <span className="font-semibold">non-refundable</span> once
          generated and delivered, as they are custom-prepared.
        </li>
        <li>
          If you do not receive your report within the promised timeframe,
          please contact our support team. In such cases, we will either resend
          the report or process a refund if undelivered.
        </li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">4. Cancellations by the User</h2>
      <p className="mb-4">
        Users are not allowed to cancel services after booking. However, in case
        of an emergency, you may request rescheduling at least{" "}
        <span className="font-semibold">6 hours before</span> the scheduled
        consultation. Approval is subject to astrologer availability.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">5. Cancellations by Astro Bhavana</h2>
      <p className="mb-4">
        In rare cases where we need to cancel a session or service due to
        unforeseen reasons (astrologer unavailability, technical issues, etc.),
        you will be entitled to a{" "}
        <span className="font-semibold">full refund</span> or a rescheduled
        session at no extra cost.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">6. Refund Processing Time</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Approved refunds will be processed within{" "}
          <span className="font-semibold">7–10 working days</span> from the date
          of confirmation.
        </li>
        <li>
          Refunds will be credited to the original mode of payment (credit/debit
          card, wallet, UPI, etc.).
        </li>
        <li>
          Astro Bhavana is not responsible for delays caused by banks or payment
          gateways.
        </li>
      </ul>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Us</h2>
      <p>
        If you have any concerns about refunds or cancellations, please contact
        our support team at: <br />
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
