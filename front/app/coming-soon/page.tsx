"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Construction, Link } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="max-w-md w-full text-center shadow-lg p-6">
        <CardHeader>
          <Construction className="mx-auto h-12 w-12 text-yellow-500" />
          <CardTitle className="text-2xl mt-2">Page Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            We’re working hard to bring this feature to you. <br />
            Please check back later!
            
          </p><a href="/" className="text-blue-500">Back to Home</a>
        </CardContent>
      </Card>
    </div>
  )
}
