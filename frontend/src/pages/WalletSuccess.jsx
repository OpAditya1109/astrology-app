import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function WalletSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Prevent browser back
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };

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

        if (data.success && data.transaction) {
          setTransaction(data.transaction);

          // 🚫 If already completed (paid/failed), disable further action
          if (["paid", "failed"].includes(data.transaction.status)) {
            console.log("Transaction already completed. User cannot replay payment.");
          }
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
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/user/wallet")}
        >
          Go to Wallet
        </button>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-yellow-600">
        <h2 className="text-xl font-semibold">Transaction not found</h2>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/user/wallet")}
        >
          Go to Wallet
        </button>
      </div>
    );
  }

  const statusColor =
    transaction.status === "paid"
      ? "text-green-600"
      : transaction.status === "failed"
      ? "text-red-600"
      : transaction.status === "pending"
      ? "text-yellow-600"
      : "text-gray-600";

  const statusText =
    transaction.status === "paid"
      ? "Payment Successful 🎉"
      : transaction.status === "failed"
      ? "Payment Failed ❌"
      : transaction.status === "pending"
      ? "Payment Pending ⏳"
      : `Payment Status: ${transaction.status}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className={statusColor + " text-center"}>
        <h2 className="text-2xl font-bold">{statusText}</h2>
        {transaction.status === "paid" && <p className="mt-2">Your wallet has been credited.</p>}
        {transaction.status === "pending" && (
          <p className="mt-2">We are still waiting for confirmation. Do not refresh or go back.</p>
        )}
        {transaction.status === "failed" && <p className="mt-2">Your transaction could not be processed.</p>}
      </div>

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

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/user/wallet")}
      >
        Back to Wallet
      </button>
    </div>
  );
}
