import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderPayment = () => {
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Load user from sessionStorage
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill all address fields");
      return;
    }

    try {
      setLoading(true);

      console.log("Order submitted:", {
        userId: user._id,
        productId: dummyProduct.id,
        amount: dummyProduct.price,
        ...formData,
      });

      // Simulate success response
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit order");
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
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-lg font-semibold mb-2">{dummyProduct.name}</h2>
      <p className="text-xl font-bold mb-4">₹{dummyProduct.price}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>

      {success && <p className="mt-3 text-green-600 font-medium">Order submitted successfully!</p>}
      {error && <p className="mt-3 text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default OrderPayment;
