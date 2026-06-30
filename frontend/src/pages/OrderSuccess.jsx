import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import products from "../data/product";

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const order_id = query.get("order_id");

    if (!order_id) {
      navigate("/", { replace: true });
      return;
    }

    // For OrderSuccess, we just fetch the stored order status (no signature needed here)
    const fetchOrder = async () => {
      try {
        // Use a GET status endpoint or the verify endpoint with just orderId for display
        const res = await axios.get(
          `https://bhavanaastro.onrender.com/api/orders/status/${order_id}`
        );
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.search, navigate]);

  const handleRetryPayment = useCallback(async () => {
    if (!order) return;
    try {
      setRetryLoading(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay. Check your internet.");
        return;
      }

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/orders/retry-payment",
        { orderId: order.orderId }
      );

      const { razorpayOrderId, keyId, amount, currency, name, email, phone } = res.data;

      const options = {
        key: keyId,
        amount,
        currency: currency || "INR",
        name: "AstroBhavana Shop",
        description: "Retry Payment",
        order_id: razorpayOrderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#16a34a" },
        handler: async function (response) {
          try {
            setRetryLoading(true);
            await axios.post(
              "https://bhavanaastro.onrender.com/api/orders/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.orderId,
              }
            );
            // Reload to show updated status
            navigate(0);
          } catch (err) {
            console.error(err);
            alert("Payment succeeded but verification failed. Contact support.");
          } finally {
            setRetryLoading(false);
          }
        },
        modal: {
          ondismiss: () => setRetryLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        setRetryLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
      setRetryLoading(false);
    }
  }, [order, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return null;

  const isPaid = order.status === "paid";
  const product = products.find((p) => p.id === order.productId);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-6">
      {product && (
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-64 object-contain rounded-xl shadow-md"
        />
      )}

      {isPaid ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
          <p className="text-lg mb-4">
            Thank you, <span className="font-semibold">{order.name}</span>. Your order has been successfully placed.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4 text-orange-600">Payment Pending</h1>
          <p className="text-lg mb-4">
            Hey <span className="font-semibold">{order.name}</span>, we know you're excited!
            Your order is ready, but the payment is still pending. Don't worry, one click and your order will be confirmed.
          </p>
          <button
            onClick={handleRetryPayment}
            disabled={retryLoading}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {retryLoading ? "Redirecting to Payment..." : "Complete Payment"}
          </button>
        </>
      )}

      <div className="border-t pt-4 space-y-3">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <p><span className="font-semibold">Order ID:</span> {order.orderId}</p>
        <p><span className="font-semibold">Product:</span> {product?.name}</p>
        <p><span className="font-semibold">Amount:</span> ₹{order.amount}</p>
        <p><span className="font-semibold">Status:</span> {order.status}</p>
      </div>

      <div className="border-t pt-4 space-y-3">
        <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
        <p><span className="font-semibold">Name:</span> {order.name}</p>
        <p><span className="font-semibold">Email:</span> {order.email}</p>
        <p><span className="font-semibold">Phone:</span> {order.phone}</p>
        <p>
          <span className="font-semibold">Address:</span> {order.address}, {order.city}, {order.state} - {order.pincode}
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="w-full mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;