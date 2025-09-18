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

  // Fetch transaction status
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

        if (data.success && data.transaction) {
          setTransaction(data.transaction);

          // Auto redirect if completed
          if (["paid", "failed", "cancelled"].includes(data.transaction.status)) {
            setTimeout(() => navigate("/user/wallet"), 5000);
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
  }, [orderId, navigate]);

  // Block back & redirect to home
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true }); // Redirect to home
    };

    window.history.pushState(null, "", window.location.href); // Push current state
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

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
      : "Payment Cancelled ⚠️";

  const statusMessage =
    transaction.status === "paid"
      ? "Your wallet has been credited."
      : transaction.status === "pending"
      ? "We are still waiting for confirmation. Do not refresh or go back."
      : transaction.status === "failed"
      ? "Your transaction could not be processed."
      : "You have cancelled this transaction. No wallet credit has been made.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pointer-events-none opacity-90">
      <div className={statusColor + " text-center"}>
        <h2 className="text-2xl font-bold">{statusText}</h2>
        <p className="mt-2">{statusMessage}</p>
      </div>

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
