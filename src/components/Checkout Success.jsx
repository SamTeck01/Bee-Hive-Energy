import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import config from "../config/environment";

export default function CheckoutSuccess() {
  // 1) Read the ?reference=xxxx from the URL
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  // 2) State to show payment verification status
  const [status, setStatus] = useState("verifying"); // verifying | success | failed

  useEffect(() => {
    // 3) Call backend to verify payment (optional but recommended)
    const verifyPayment = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/orders/verify/${reference}`);
        if (res.data.status === "paid") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    if (reference) {
      verifyPayment();
    } else {
      setStatus("failed");
    }
  }, [reference]);

  // 4) UI rendering
  return (
    <div className="container mx-auto py-24 px-4 text-center">
      {status === "verifying" && (
        <p className="text-gray-600 text-lg">Verifying your payment...</p>
      )}

      {status === "success" && (
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
          <p className="mb-6">Thank you! Your order has been confirmed.</p>
          <Link to="/" className="bg-gold2 text-white px-6 py-2 rounded-md">
            Back to Home
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
          <p className="mb-6">We couldn’t verify your payment. Please try again.</p>
          <Link to="/checkout" className="bg-gray-700 text-white px-6 py-2 rounded-md">
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
}
