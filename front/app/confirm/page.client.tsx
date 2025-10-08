"use client"; // 👈 Required so hooks work in App Router
export const dynamic = "force-dynamic";  // 👈 ensure it's runtime-only
export const revalidate = 0; 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ replaces next/router

interface PaymentResponse {
  status: string;
  message: string;
}

export default function PaymentConfirm() {
  const searchParams = useSearchParams();
  const OrderMerchantReference = searchParams.get("OrderMerchantReference");
  const OrderTrackingId = searchParams.get("OrderTrackingId");

  const [status, setStatus] = useState<string>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!OrderMerchantReference || !OrderTrackingId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pesapal/callback/?OrderMerchantReference=${OrderMerchantReference}&OrderTrackingId=${OrderTrackingId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payment status");
        }

        const data: PaymentResponse = await res.json();
        setStatus(data.status?.toLowerCase());
        setMessage(data.message || "");
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

      {(status === "failed" || status === "cancelled" || status === "error") && (
        <>
          <h1 style={{ color: "red" }}>❌ Payment Failed</h1>
          <p>{message}</p>
        </>
      )}

      {status !== "loading" &&
        status !== "completed" &&
        status !== "failed" &&
        status !== "cancelled" &&
        status !== "error" && (
          <>
            <h1 style={{ color: "orange" }}>⏳ Pending</h1>
            <p>{message}</p>
          </>
        )}
    </div>
  );
}
