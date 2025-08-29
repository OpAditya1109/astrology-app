import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment({ userId, userName, userEmail }) {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const amount = params.get("amount");

  const openRazorpayCheckout = useCallback(() => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: amount * 100,
      currency: "INR",
      name: "AstroConnect Wallet",
      description: `Add ₹${amount} to your wallet`,
      handler: async function (response) {
        try {
          const res = await fetch("/api/wallet/add-funds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              amount,
              paymentId: response.razorpay_payment_id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            alert(`Payment Successful! ₹${amount} added to your wallet.`);
            navigate("/user/wallet");
          } else {
            alert(`Payment succeeded, but wallet update failed: ${data.error}`);
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong while updating your wallet.");
        }
      },
      prefill: {
        name: userName || "",
        email: userEmail || "",
      },
      theme: { color: "#6b21a8" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert(`Payment Failed: ${response.error.description}`);
      navigate("/user/wallet");
    });
    rzp.open();
  }, [amount, userId, userName, userEmail, navigate]);

  useEffect(() => {
    if (!amount) {
      navigate("/user/wallet");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = openRazorpayCheckout;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, navigate, openRazorpayCheckout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-700 text-lg">Redirecting to payment of ₹{amount}...</p>
    </div>
  );
}
