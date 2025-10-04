"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    setIsLoggedIn(false)
    window.location.href = "/" // optional: redirect to homepage
  }

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-manrope)]">
                Just One Thought
              </h1>
              <p className="text-sm opacity-90">J.O.T</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link href="/products" className="hover:text-accent transition-colors">
              Products
            </Link>
            <Link href="/coming-soon" className="hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/coming-soon" className="hover:text-accent transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth + Cart */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
              <Link href="/cart">Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
