"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Download, Search, Filter, Calendar, AlertCircle, CheckCircle, User } from "lucide-react"
import Link from "next/link"
import { DownloadManager } from "@/components/download-manager"

// Mock user data - in production, this would come from authentication
const mockUser = {
  id: "user123",
  email: "customer@example.com",
  firstName: "John",
  lastName: "Doe",
  joinDate: "2024-01-15",
}

// Mock purchase history - in production, this would come from API
const mockPurchases = [
  {
    orderId: "ORDER_1703123456_abc123",
    date: "2024-01-20",
    total: 53.58,
    status: "completed",
    items: [
      {
        id: 1,
        title: "Ultimate Life Planner 2024",
        price: 29.99,
        downloadLimit: 3,
        downloadCount: 1,
        image: "/digital-planner-calendar.png",
        category: "Planner",
        fileSize: "12.5 MB",
      },
      {
        id: 2,
        title: "Mindfulness Journal Collection",
        price: 19.99,
        downloadLimit: 5,
        downloadCount: 0,
        image: "/zen-mindfulness-journal.png",
        category: "Journal",
        fileSize: "8.2 MB",
      },
    ],
  },
  {
    orderId: "ORDER_1702987654_def456",
    date: "2024-01-10",
    total: 15.99,
    status: "completed",
    items: [
      {
        id: 4,
        title: "Student Success Planner",
        price: 15.99,
        downloadLimit: 4,
        downloadCount: 4,
        image: "/colorful-student-planner.png",
        category: "Planner",
        fileSize: "9.8 MB",
      },
    ],
  },
]

export default function DownloadsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Flatten all items from all purchases
  const allItems = mockPurchases.flatMap((purchase) =>
    purchase.items.map((item) => ({
      ...item,
      orderId: purchase.orderId,
      purchaseDate: purchase.date,
    })),
  )

  // Filter items based on search and category
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(allItems.map((item) => item.category.toLowerCase())))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-manrope)]">DigitalPlanners</h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">
                  {mockUser.firstName} {mockUser.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-manrope)] mb-2">My Downloads</h1>
          <p className="text-muted-foreground">Manage and download your purchased digital products</p>
        </div>

        <Tabs defaultValue="downloads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="downloads">My Downloads</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="downloads" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your downloads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md bg-background"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Downloads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={`${item.orderId}-${item.id}`} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">{item.category}</Badge>
                      {item.downloadCount >= item.downloadLimit ? (
                        <Badge variant="destructive" className="absolute top-3 right-3">
                          Limit Reached
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="absolute top-3 right-3">
                          {item.downloadLimit - item.downloadCount} Left
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 font-[family-name:var(--font-manrope)]">{item.title}</CardTitle>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Downloads:</span>
                        <span>
                          {item.downloadCount} / {item.downloadLimit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">File Size:</span>
                        <span>{item.fileSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Purchased:</span>
                        <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <DownloadManager
                        fileId={item.id.toString()}
                        fileName={item.title}
                        userId={mockUser.email}
                        initialLimit={item.downloadLimit}
                      />
                    </div>

                    {item.downloadCount >= item.downloadLimit && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>Download limit reached</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No downloads found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't purchased any digital products yet"}
                  </p>
                  <Button asChild>
                    <Link href="/">Browse Products</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {mockPurchases.map((order) => (
                <Card key={order.orderId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.orderId.split("_")[1]}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <div className="text-lg font-bold">${order.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{item.category}</span>
                              <span>•</span>
                              <span>
                                {item.downloadCount}/{item.downloadLimit} downloads used
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}