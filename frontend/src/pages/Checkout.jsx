import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import products from "../data/product"; // import product list

const OrderPayment = () => {
  const { id } = useParams(); // get product id from URL
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id); // find the product from product list
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
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (!product) {
      navigate("/"); // redirect if product not found
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

      const payload = {
        userId: user.id, // user id from session
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

      console.log("Sending order payload:", payload);

      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/orders/create-order",
        payload
      );

      const { orderId, paymentSessionId } = res.data;
      setOrderId(orderId);

      const cashfree = await load({ mode: "production" });
      await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
    } catch (err) {
      console.error(err);
      setError("Failed to initiate payment. Check backend or network.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await axios.post(
        "https://bhavanaastro.onrender.com/api/orders/verify",
        { orderId }
      );
      setStatus(res.data.orderStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to verify payment");
    } finally {
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

        <button onClick={handlePayNow} disabled={loading} className="mt-4 w-full bg-green-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-700 transition">
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

        {orderId && (
          <button onClick={handleVerify} className="mt-2 w-full bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Verify Payment
          </button>
        )}

        {status && <p className="mt-3 font-medium text-gray-700">Status: {status}</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default OrderPayment;
