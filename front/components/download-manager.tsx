"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, AlertCircle, CheckCircle } from "lucide-react"

interface DownloadManagerProps {
  fileId: string
  fileName: string
  userId: string
  initialLimit: number
}

export function DownloadManager({ fileId, fileName, userId, initialLimit }: DownloadManagerProps) {
  const [downloadStatus, setDownloadStatus] = useState({
    downloadCount: 0,
    downloadLimit: initialLimit,
    remainingDownloads: initialLimit,
    active: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDownloadStatus()
  }, [fileId, userId])

  const fetchDownloadStatus = async () => {
    try {
      const response = await fetch(`/api/download-status/${fileId}?userId=${userId}`)
      if (response.ok) {
        const status = await response.json()
        setDownloadStatus(status)
      }
    } catch (error) {
      console.error("Failed to fetch download status:", error)
    }
  }

  const handleDownload = async () => {
    if (!downloadStatus.active) return

    setIsLoading(true)
    try {
      window.open(`/api/download/${fileId}?userId=${userId}`, "_blank")

      setTimeout(() => {
        fetchDownloadStatus()
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Download failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          {fileName}
        </CardTitle>
        <CardDescription>Digital download with usage tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Downloads used:</span>
          <Badge variant={downloadStatus.active ? "secondary" : "destructive"}>
            {downloadStatus.downloadCount} / {downloadStatus.downloadLimit}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Remaining:</span>
          <span className="font-medium">{downloadStatus.remainingDownloads}</span>
        </div>

        {downloadStatus.active ? (
          <Button onClick={handleDownload} disabled={isLoading} className="w-full">
            {isLoading ? "Downloading..." : "Download File"}
          </Button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">Download limit reached</span>
          </div>
        )}

        {downloadStatus.downloadCount > 0 && downloadStatus.active && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">File accessed successfully</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}