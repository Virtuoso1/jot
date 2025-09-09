import { type NextRequest, NextResponse } from "next/server"

// Mock database - same reference as download route
const downloadTracking = new Map<string, { count: number; limit: number; url: string; active: boolean }>()

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const fileId = params.fileId
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const trackingKey = `${fileId}-${userId}`
    const tracking = downloadTracking.get(trackingKey)

    if (!tracking) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({
      downloadCount: tracking.count,
      downloadLimit: tracking.limit,
      remainingDownloads: Math.max(0, tracking.limit - tracking.count),
      active: tracking.active,
    })
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Status check failed" }, { status: 500 })
  }
}