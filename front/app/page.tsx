import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Shield, Users, CheckCircle, Heart, BookOpen } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

const featuredProducts = [
  {
    id: 1,
    title: "Ultimate Life Planner 2024",
    description:
      "Complete yearly planner with monthly, weekly, and daily layouts. Includes goal tracking and habit formation pages.",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviews: 1247,
    downloads: 5000,
    image: `${process.env.NEXT_PUBLIC_API_URL}/media/products/digital-planner-calendar.png`,
    category: "Planner",
    downloadLimit: 3,
    gender: "unisex",
  },
  {
    id: 2,
    title: "Mindfulness Journal Collection",
    description:
      "Beautiful collection of guided journals for meditation, gratitude, and self-reflection. 150+ pages of prompts.",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    reviews: 892,
    downloads: 3200,
    image: `${process.env.NEXT_PUBLIC_API_URL}/media/products/zen-mindfulness-journal.png`,
    category: "Journal",
    downloadLimit: 5,
    gender: "feminine",
  },
  {
    id: 3,
    title: "Business Strategy Workbook",
    description:
      "Comprehensive workbook for entrepreneurs and business owners. Includes templates, worksheets, and planning tools.",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 634,
    downloads: 1800,
    image: `${process.env.NEXT_PUBLIC_API_URL}/media/products/business-workbook.png`,
    category: "Workbook",
    downloadLimit: 2,
    gender: "masculine",
  },
  {
    id: 4,
    title: "Student Success Planner",
    description:
      "Academic planner designed for students. Includes semester planning, assignment tracking, and study schedules.",
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.9,
    reviews: 2156,
    downloads: 8500,
    image: `${process.env.NEXT_PUBLIC_API_URL}/media/products/colorful-student-planner_x09bDRx.png`,
    category: "Planner",
    downloadLimit: 4,
    gender: "unisex",
  },
]

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

export default function HomePage() {
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
            </div>
          </div>
          <h2 className="text-5xl font-bold font-[family-name:var(--font-manrope)] mb-6 text-foreground">
            Capture Every Thought,
            <br />
            <span className="text-accent">Plan Every Dream</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            From soft, feminine designs to bold, masculine layouts - our digital journals and planners are crafted for
            every personality. One thought at a time, build the life you envision.
          </p>
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
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow duration-300 border-2 hover:border-accent/20"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${
                        product.gender === "feminine"
                          ? "bg-accent text-accent-foreground"
                          : product.gender === "masculine"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {product.category}
                    </Badge>
                    {product.originalPrice > product.price && (
                      <Badge variant="destructive" className="absolute top-3 right-3">
                        Sale
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 font-[family-name:var(--font-manrope)]">{product.title}</CardTitle>
                  <CardDescription className="text-sm mb-3 line-clamp-2">{product.description}</CardDescription>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-accent">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.downloadLimit} downloads
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    {product.downloads.toLocaleString()} downloads
                  </div>
                </CardContent>
               
              </Card>
            ))}
          </div>
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