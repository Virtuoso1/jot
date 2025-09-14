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
            <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            <p className="mt-1 text-sm font-medium">${product.price}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full"><Link href="/coming-soon">Add to Cart</Link></Button>
          </CardFooter>
        </Card>
        ))}
        </div>
      </ul>
    </div>
  )
}
