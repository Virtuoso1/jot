"use client"

import { useState } from "react"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [orderId, setOrderId] = useState<number | null>(null)
  const [amount, setAmount] = useState<number | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    const token = localStorage.getItem("access")

if (!token) {
  alert("You must be logged in to checkout")
  return
}

    try {
      // 1. Place order first
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone_number: phone, address }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Checkout failed")

      // Save order details
      setOrderId(data.order_id)
      setAmount(parseFloat(data.total_amount))

      // 2. Initiate Pesapal payment
      console.log("Checkout response:", data)

console.log("Sending payment payload:", {
  order_id: data.order_id,
  amount: data.total_amount,
  phone,
  email,
})
      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/initiate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: data.order_id,
          amount: parseFloat(data.total_amount),
          phone_number: phone,
          email: email,
        }),
      })

      const payData = await payRes.json()
      if (!payRes.ok) throw new Error(payData.error || "Payment init failed")

      console.log("Pesapal response:", payData)

      // If Pesapal gives you a redirect URL
      if (payData.redirect_url) {
        window.location.href = payData.redirect_url
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />

      <input
        type="text"
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 block w-full"
      />

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Redirecting..." : "Pay with Pesapal"}
      </button>
    </div>
  )
}
