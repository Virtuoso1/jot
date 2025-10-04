"use client"
import { useEffect, useState } from "react"

export default function PaymentResult() {
  const [status, setStatus] = useState("Checking...")

  useEffect(() => {
    // You might get ?status or ?transaction_id in the URL
    const params = new URLSearchParams(window.location.search)
    const txId = params.get("transaction_id")

    if (txId) {
      // Optionally call backend to verify
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify/${txId}/`)
        .then(res => res.json())
        .then(data => setStatus(data.status))
    } else {
      setStatus("No transaction found")
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Payment Result</h1>
      <p>Status: {status}</p>
    </div>
  )
}
