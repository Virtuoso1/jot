"use client"

import { useEffect, useState } from "react"

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reviewingItem, setReviewingItem] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")

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

  const handleSubmitReview = async (cartItemId: number) => {
  const token = localStorage.getItem("access")
  if (!token) {
    alert("You must be logged in to leave a review.")
    return
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/cart/${cartItemId}/review/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // ✅ Make sure this is included
        },
        body: JSON.stringify({ rating, comment }),
      }
    )

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Failed: ${res.status} ${errorText}`)
    }

    alert("Review submitted!")
    setReviewingItem(null)
    setRating(0)
    setComment("")
  } catch (err) {
    console.error(err)
    alert("Something went wrong submitting review")
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
            className="flex flex-col border p-4 mb-2 rounded"
          >
            <div className="flex justify-between items-center">
              <span>
                {item.product.name} — {item.quantity} × Ksh. {item.product.price} = Ksh. {item.total_price}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Remove
                </button>
                <button
                  onClick={() =>
                    setReviewingItem(reviewingItem === item.id ? null : item.id)
                  }
                  className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  {reviewingItem === item.id ? "Cancel" : "Rate"}
                </button>
              </div>
            </div>

            {reviewingItem === item.id && (
              <div className="mt-3 border-t pt-3">
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={(hover || rating) >= star ? "gold" : "none"}
                      viewBox="0 0 24 24"
                      stroke="gold"
                      className="w-6 h-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.35 4.162a1 1 0 00.95.69h4.378c.969 0 1.371 1.24.588 1.81l-3.54 2.572a1 1 0 00-.364 1.118l1.35 4.162c.3.921-.755 1.688-1.54 1.118l-3.54-2.572a1 1 0 00-1.176 0l-3.54 2.572c-.784.57-1.838-.197-1.539-1.118l1.35-4.162a1 1 0 00-.364-1.118L2.78 9.589c-.783-.57-.38-1.81.588-1.81h4.378a1 1 0 00.95-.69l1.35-4.162z"
                      />
                    </svg>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Leave a comment..."
                  className="border p-2 w-full mb-2 rounded"
                />

                <button
                  onClick={() => handleSubmitReview(item.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Submit Review
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">Total: Ksh. {total}</p>
      <a href="/checkout" className="button-class">
        Checkout
      </a>
    </div>
  )
}
