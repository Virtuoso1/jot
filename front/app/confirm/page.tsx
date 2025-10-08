import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface PaymentResponse {
  status: string;
  message: string;
}

export default function PaymentConfirm() {
  const router = useRouter();
  const { OrderMerchantReference, OrderTrackingId } = router.query;

  const [status, setStatus] = useState<string>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!OrderMerchantReference || !OrderTrackingId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/pesapal/callback/?OrderMerchantReference=${OrderMerchantReference}&OrderTrackingId=${OrderTrackingId}`
        );

        const data: PaymentResponse = await res.json();
        setStatus(data.status);
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong checking payment status.");
      }
    };

    fetchStatus();
  }, [OrderMerchantReference, OrderTrackingId]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem", fontFamily: "sans-serif" }}>
      {status === "loading" && <h1>⏳ Checking payment status...</h1>}

      {status === "completed" && (
        <>
          <h1 style={{ color: "green" }}>✅ Payment Successful!</h1>
          <p>{message}</p>
        </>
      )}

      {(status === "failed" || status === "cancelled") && (
        <>
          <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
          <p>{message}</p>
        </>
      )}

      {status !== "loading" &&
        status !== "completed" &&
        status !== "failed" &&
        status !== "cancelled" && (
          <>
            <h1 style={{ color: "orange" }}>⏳ Pending</h1>
            <p>{message}</p>
          </>
        )}
    </div>
  );
}
