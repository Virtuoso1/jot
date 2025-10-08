"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Shield, Users, CheckCircle, Heart, BookOpen } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured/`)
        const data = await res.json()
        setFeaturedProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      }
    }
    fetchFeatured()
  }, [])

  // 🔹 Helper to truncate after 2 sentences
  const truncateDescription = (text: string) => {
    if (!text) return ""
    const sentences = text.split(". ")
    return sentences.slice(0, 2).join(". ") + (sentences.length > 2 ? "..." : "")
  }


const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Entrepreneur",
    content:
      "These digital planners have completely transformed how I organize my business and personal life. The quality is outstanding!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Student",
    content: "The Student Success Planner helped me improve my grades significantly. Worth every penny!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Life Coach",
    content: "I recommend these journals to all my clients. The mindfulness collection is particularly well-designed.",
    rating: 5,
  },
]

// 🔹 Pesapal Test Payment Handle
// r
const [loading, setLoading] = useState(false)

  const handleTestPayment = async () => {
    setLoading(true)
    try {
      // 🔑 Hardcoded test order details
      const order_id = `2`
      const amount = 1.0
      const phone = "254703385412" // replace with your test phone
      const email = "waynekimutai20@gmail.com"

      // Call your backend (not Pesapal directly in frontend for security!)
      // This assumes you have /api/pesapal-test/ set up in your Django backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/pesapal/initiate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id, amount, phone, email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to init payment")

      console.log("Pesapal test response:", data)

      if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        alert("No redirect URL received")
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/20 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-secondary/20 px-4 py-2 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Thoughtfully Designed for Everyone</span>
            <h1 className="text-2xl font-bold mb-4">Pesapal Test</h1>
                  <button
                    onClick={handleTestPayment}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Processing..." : "Test 1"}
                  </button>
            </div>
          </div>
          <h2 className="text-5xl font-bold font-[family-name:var(--font-manrope)] mb-6 text-foreground">
            Capture Every Thought,
            <br />
            <span className="text-accent">Plan Every Dream</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            From soft, feminine designs to bold, masculine layouts - our journals and planners (digital and physical copies) are crafted for every personality. One thought at a time, build the life you envision.
Write it. Plan it. Slay it.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Link href="/products">Explore Collections</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Secure Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-accent" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">Featured Collections</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular digital planners and journals, designed for every style and personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
          
{featuredProducts.map((product) => (
  <Link 
      key={product.id} 
      href={`/products`} 
      className="group"
    >
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border hover:border-accent/30">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-accent text-white">Featured</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <CardDescription className="text-sm mb-3">
                    {truncateDescription(product.description)}
                  </CardDescription>

                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.average_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground">
                      {product.average_rating?.toFixed(1)} / 5
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">Ksh. {product.price}</span>
                    <Badge variant="outline" className="text-xs">
                      In stock: {product.quantity}
                    </Badge>
                  </div>
                </CardContent>
              </Card></Link>
            ))}</div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">What Our Customers Say</h3>
            <p className="text-muted-foreground">
              Join thousands of satisfied customers who have transformed their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-accent/20 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-accent fill-accent" />
          </div>
          <h3 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-4">
            Ready to Capture Your Thoughts?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join the J.O.T community and discover how one thought can transform your entire day.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/signup">Begin Your Story</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-accent fill-accent" />
                <h4 className="font-bold font-[family-name:var(--font-manrope)]">Just One Thought</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Thoughtfully designed digital planners and journals for every personality - from soft and feminine to
                bold and masculine.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Planners
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Journals
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Workbooks
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Bundles
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    My Downloads
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 Just One Thought (J.O.T). All rights reserved. Secure digital downloads with limited access
              protection.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}