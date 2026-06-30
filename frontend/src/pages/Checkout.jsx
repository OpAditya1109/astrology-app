import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const OrderPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.mobile || "",
      }));
    } else {
      setLoginMessage("Please login to place an order.");
      const timer = setTimeout(() => navigate("/login"), 1500);
      return () => clearTimeout(timer);
    }
  }, [navigate, product]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open Razorpay checkout modal
  const openRazorpayCheckout = useCallback(
    ({ razorpayOrderId, keyId, amount, currency, internalOrderId }) => {
      const options = {
        key: keyId,
        amount,           // paise from backend
        currency: currency || "INR",
        name: "AstroBhavana Shop",
        description: product?.name || "Product Purchase",
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#16a34a" },
        handler: async function (response) {
          try {
            setLoading(true);
            const res = await axios.post(
              "https://bhavanaastro.onrender.com/api/orders/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: internalOrderId,
              }
            );
            setStatus(res.data.orderStatus);
            // Redirect to order success page
            navigate(`/order-success?order_id=${internalOrderId}`);
          } catch (err) {
            console.error(err);
            setError("Payment succeeded but verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    },
    [formData, product, navigate]
  );

  const handlePayNow = async () => {
    const { name, email, phone, address, city, state, pincode } = formData;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      setError("Please fill all delivery details");
      return;
    }

    setError("");
    setStatus(null);

    try {
      setLoading(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const payload = {
        userId: user.id,
        productId: product.id,
        amount: product.price,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
      };

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/orders/create-order",
        payload
      );

      const { orderId, razorpayOrderId, keyId, amount: rzpAmount, currency } = res.data;

      openRazorpayCheckout({ razorpayOrderId, keyId, amount: rzpAmount, currency, internalOrderId: orderId });
    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment. Check backend or network.");
      setLoading(false);
    }
  };

  if (!user || !product) {
    return (
      <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl text-center">
        <p className="text-red-600 font-medium">{loginMessage || "Product not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-3xl grid md:grid-cols-2 gap-8">
      {/* Left: Product Info */}
      <div className="flex flex-col items-center md:items-start">
        <img
          src={product.img}
          alt={product.name}
          className="w-60 h-60 object-contain rounded-xl shadow-md mb-6"
        />
        <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
        <p className="text-xl font-bold text-green-700 mb-4">₹{product.price}</p>
        <p className="text-gray-600 mb-2">{product.description}</p>
      </div>

      {/* Right: Delivery Details & Payment */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="w-full p-3 border rounded-lg" />

        <button
          onClick={handlePayNow}
          disabled={loading}
          className="mt-4 w-full bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

        {status && <p className="mt-3 font-medium text-gray-700">Status: {status}</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default OrderPayment;