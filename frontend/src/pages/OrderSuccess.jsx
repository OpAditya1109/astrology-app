import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order details from location state (passed from checkout/order page)
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      // If no order info, redirect to home
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  if (!order) {
    return null; // or a loader
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Order Confirmed!</h1>
      
      <p className="text-lg mb-4">
        Thank you, <span className="font-semibold">{order.name}</span>. Your order has been successfully placed.
      </p>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <p><span className="font-semibold">Order ID:</span> {order.orderId}</p>
        <p><span className="font-semibold">Product ID:</span> {order.productId}</p>
        <p><span className="font-semibold">Amount:</span> ₹{order.amount}</p>
        <p><span className="font-semibold">Status:</span> {order.status}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
        <p><span className="font-semibold">Name:</span> {order.name}</p>
        <p><span className="font-semibold">Email:</span> {order.email}</p>
        <p><span className="font-semibold">Phone:</span> {order.phone}</p>
        <p><span className="font-semibold">Address:</span> {order.address}, {order.city}, {order.state} - {order.pincode}</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
