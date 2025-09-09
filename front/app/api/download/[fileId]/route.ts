import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
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
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 })
    }

    if (!tracking.active) {
      return NextResponse.json({ error: "Download limit exceeded" }, { status: 403 })
    }

    tracking.count += 1

    if (tracking.count >= tracking.limit) {
      tracking.active = false
    }

    downloadTracking.set(trackingKey, tracking)

    return NextResponse.redirect(tracking.url)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const { userId, fileUrl, downloadLimit } = await request.json()
    const fileId = params.fileId

    if (!userId || !fileUrl || !downloadLimit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const trackingKey = `${fileId}-${userId}`
    downloadTracking.set(trackingKey, {
      count: 0,
      limit: downloadLimit,
      url: fileUrl,
      active: true,
    })

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download/${fileId}?userId=${userId}`,
      remainingDownloads: downloadLimit,
    })
  } catch (error) {
    console.error("Setup download error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}