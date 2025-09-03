import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function WalletSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!orderId) {
          setError("No order ID found in the URL");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `https://bhavanaastro.onrender.com/api/wallet/status/${orderId}`
        );

        if (data.success) {
          setTransaction(data.transaction);
        } else {
          setError("Unable to fetch transaction status");
        }
      } catch (err) {
        setError("Error fetching transaction: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Processing your payment...</h2>
        <p className="text-gray-500 mt-2">Please wait while we verify your transaction.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <h2 className="text-xl font-semibold">Payment Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-yellow-600">
        <h2 className="text-xl font-semibold">Transaction not found</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {transaction.status === "paid" ? (
        <div className="text-green-600">
          <h2 className="text-2xl font-bold">Payment Successful 🎉</h2>
          <p className="mt-2">Your wallet has been credited.</p>
        </div>
      ) : transaction.status === "failed" ? (
        <div className="text-red-600">
          <h2 className="text-2xl font-bold">Payment Failed ❌</h2>
          <p className="mt-2">Your transaction could not be processed.</p>
        </div>
      ) : transaction.status === "pending" ? (
        <div className="text-yellow-600">
          <h2 className="text-2xl font-bold">Payment Pending ⏳</h2>
          <p className="mt-2">We are still waiting for confirmation.</p>
        </div>
      ) : (
        <div className="text-gray-600">
          <h2 className="text-2xl font-bold">Payment Status</h2>
          <p className="mt-2">Current status: {transaction.status}</p>
        </div>
      )}

      {/* Transaction details */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Transaction Details</h3>
        <p><strong>Order ID:</strong> {transaction.orderId}</p>
        <p><strong>Amount:</strong> ₹{transaction.amount}</p>
        <p><strong>Status:</strong> {transaction.status}</p>
        {transaction.paymentId && <p><strong>Payment ID:</strong> {transaction.paymentId}</p>}
        {transaction.paymentMethod && <p><strong>Method:</strong> {transaction.paymentMethod}</p>}
        {transaction.paymentTime && <p><strong>Time:</strong> {transaction.paymentTime}</p>}
        {transaction.paymentMessage && <p><strong>Message:</strong> {transaction.paymentMessage}</p>}
      </div>
    </div>
  );
}
