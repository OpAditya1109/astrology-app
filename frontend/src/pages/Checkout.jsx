import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";

const OrderPayment = () => {
  // Dummy user & product for sandbox
  const dummyUser = {
    _id: "USER001",
    name: "Test User",
    email: "test@example.com",
    mobile: "9876543210",
  };

  const dummyProduct = {
    id: "PROD001",
    name: "Rose Quartz Bracelet",
    price: 599,
  };

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handlePayNow = async () => {
    setError("");
    setStatus(null);

    try {
      setLoading(true);

      // Create order on backend
      const res = await axios.post("https://bhavanaastro.onrender.com/api/orders/create-order", {
        userId: dummyUser._id,
        productId: dummyProduct.id,
        amount: dummyProduct.price,
        name: dummyUser.name,
        email: dummyUser.email,
        phone: dummyUser.mobile,
      });

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
      const res = await axios.post("http://localhost:5000/api/orders/verify", { orderId });
      setStatus(res.data.orderStatus);
    } catch (err) {
      console.error(err);
      setError("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-lg font-semibold mb-2">{dummyProduct.name}</h2>
      <p className="text-xl font-bold mb-4">₹{dummyProduct.price}</p>

      <button
        onClick={handlePayNow}
        disabled={loading}
        className="bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {orderId && (
        <div className="mt-4">
          <button
            onClick={handleVerify}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Verify Payment
          </button>
        </div>
      )}

      {status && <p className="mt-3 font-medium">Status: {status}</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default OrderPayment;
