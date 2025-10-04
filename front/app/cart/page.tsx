"use client"

import { useEffect, useState } from "react"

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    const token = localStorage.getItem("access")
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to load cart")
      const data = await res.json()
      setCart(data)
    } catch (err) {
      console.error(err)
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (productId: number) => {
    const token = localStorage.getItem("access")
    if (!token) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        }
      )

      if (!res.ok) throw new Error("Failed to remove item")

      // Refresh cart after removal
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!cart || !cart.items || cart.items.length === 0) {
    return <p>Your cart is empty.</p>
  }

  const total = cart.items.reduce(
    (acc: number, item: any) => acc + item.total_price,
    0
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul>
        {cart.items.map((item: any) => (
          <li
            key={item.id}
            className="flex justify-between items-center border p-4 mb-2 rounded"
          >
            <div>
              {item.product.name} — {item.quantity} × Ksh. {item.product.price} = Ksh. {item.total_price}
            </div>
            <button
              onClick={() => handleRemove(item.product.id)}
              className="ml-4 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">Total: Ksh. {total}</p>
    <a href="/checkout" className="button-class">
      Checkout</a>
    </div>
  )
}
