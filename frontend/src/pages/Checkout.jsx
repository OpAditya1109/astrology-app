import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";

const OrderPayment = () => {
  const navigate = useNavigate();

  // Dummy product for sandbox
  const dummyProduct = {
    id: "PROD001",
    name: "Rose Quartz Bracelet",
    price: 1,
  };

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

  // Check user login status
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Pre-fill form fields
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
  }, [navigate]);

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

    // Log the payload before sending
    const payload = {
      userId: user.id, // Use logged-in user ID
      productId: dummyProduct.id,
      amount: dummyProduct.price,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
    };
    console.log("Sending order payload:", payload); // <-- Add this

    // Create order on backend
    const res = await axios.post(
      "https://bhavanaastro.onrender.com/api/orders/create-order",
      payload
    );

    const { orderId, paymentSessionId } = res.data;
    setOrderId(orderId);

    // Load Cashfree JS SDK and initiate checkout
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

  if (!user) {
    return (
      <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl text-center">
        <p className="text-red-600 font-medium">{loginMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl space-y-3">
      <h2 className="text-lg font-semibold">{dummyProduct.name}</h2>
      <p className="text-xl font-bold mb-4">₹{dummyProduct.price}</p>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="w-full bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {orderId && (
        <button
          onClick={handleVerify}
          className="w-full mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Verify Payment
        </button>
      )}

      {status && <p className="mt-3 font-medium">Status: {status}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default OrderPayment;
