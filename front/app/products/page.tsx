"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string
  price: string
  quantity: number
  image?: string
   average_rating?: number 
}
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

   useEffect(() => {
    const fetchProducts = async () => {
      const access = localStorage.getItem("access")
      const refresh = localStorage.getItem("refresh")

      if (!access) {
        router.push("/login")
        return
      }

      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
          headers: { Authorization: `Bearer ${access}` },
        })

        if (res.status === 401 && refresh) {
          // Try refreshing access token
          const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          })

          if (refreshRes.ok) {
            const data = await refreshRes.json()
            localStorage.setItem("access", data.access)

            // Retry original request with new access token
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, {
              headers: { Authorization: `Bearer ${data.access}` },
            })
          } else {
            throw new Error("Refresh failed")
          }
        }

        if (!res.ok) {
         console.log("Products response:", res.status, res.statusText)
            throw new Error("Failed to fetch products")
        }const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error(err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-manrope)]">
                Our Catalogue
              </h1>
              <p className="text-sm opacity-90">J.O.T</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/cart" className="hover:text-accent transition-colors">
              Cart
            </Link>
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
    <br/>
      <ul className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {products.map(product => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-2 hover:border-accent/20">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>Available: {product.quantity}</CardDescription>
          </CardHeader>
          <CardContent>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
                No Image
              </div>
            )}
                    {/* ⭐ Show rating if exists */}
          {product.average_rating ? (
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={(product.average_rating??4) >= star ? "gold" : "none"}
                  stroke="gold"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.35 4.162a1 1 0 00.95.69h4.378c.969 0 1.371 1.24.588 1.81l-3.54 2.572a1 1 0 00-.364 1.118l1.35 4.162c.3.921-.755 1.688-1.54 1.118l-3.54-2.572a1 1 0 00-1.176 0l-3.54 2.572c-.784.57-1.838-.197-1.539-1.118l1.35-4.162a1 1 0 00-.364-1.118L2.78 9.589c-.783-.57-.38-1.81.588-1.81h4.378a1 1 0 00.95-.69l1.35-4.162z"
                  />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-700">
                {product.average_rating}/5
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No reviews yet</p>
          )}
            <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            <p className="mt-1 text-sm font-medium">Ksh.{product.price}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full"
              onClick={async () => {
              const token = localStorage.getItem("access")
              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add/`, {
              method: "POST",
              headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ product_id: product.id, quantity: 1 }),
            })
              alert("Added to cart!")
            }}
            >Add to Cart</Button>
          </CardFooter>
        </Card>
        ))}
        </div>
      </ul>
    </div>
  )
}
