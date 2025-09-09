"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderData, setOrderData] = useState<any>(null)

  useEffect(() => {
    // In production, fetch order data from API
    // For demo, using mock data
    if (orderId) {
      setOrderData({
        orderId,
        items: [
          {
            id: 1,
            title: "Ultimate Life Planner 2024",
            price: 29.99,
            downloadLimit: 3,
            image: "/digital-planner-calendar.png",
          },
          {
            id: 2,
            title: "Mindfulness Journal Collection",
            price: 19.99,
            downloadLimit: 5,
            image: "/zen-mindfulness-journal.png",
          },
        ],
        customer: {
          email: "customer@example.com",
          firstName: "John",
          lastName: "Doe",
        },
        total: 53.58,
        status: "completed",
        createdAt: new Date().toISOString(),
      })
    }
  }, [orderId])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading order details...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-manrope)]">DigitalPlanners</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h1>
              <p className="text-green-700">
                Thank you for your purchase. Your digital products are ready for download.
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order #{orderData.orderId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <p className="font-medium">
                    {orderData.customer.firstName} {orderData.customer.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order Date:</span>
                  <p className="font-medium">{new Date(orderData.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-medium">${orderData.total.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Your Downloads
              </CardTitle>
              <CardDescription>
                Click to download your digital products. Remember, downloads are limited!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.downloadLimit} downloads available
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PDF Format
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Email Confirmation */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">
                  A confirmation email with download links has been sent to {orderData.customer.email}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span>Download your digital products using the links above</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Save the files to your device or cloud storage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Start planning and organizing with your new digital tools!</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/account/downloads">
                View All Downloads
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}