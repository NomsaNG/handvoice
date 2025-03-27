"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface CameraFeedProps {
  onFrame?: (imageData: ImageData) => void
  processingEnabled?: boolean
  className?: string
}

export function CameraFeed({ onFrame, processingEnabled = false, className }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    let frameId: number

    const startCamera = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          setStream(mediaStream)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please ensure you've granted permission.")
        setIsLoading(false)
      }
    }

    startCamera()

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }

      // Clean up the camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Process frames when enabled
  useEffect(() => {
    if (!processingEnabled || !videoRef.current || !canvasRef.current || !onFrame) {
      return
    }

    let frameId: number
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get the image data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // Pass the image data to the callback
        onFrame(imageData)
      }

      // Schedule the next frame
      frameId = requestAnimationFrame(processFrame)
    }

    // Start processing frames
    frameId = requestAnimationFrame(processFrame)

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [processingEnabled, onFrame])

  const retryCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    setIsLoading(true)
    setError(null)

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      .then((mediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          setStream(mediaStream)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please ensure you've granted permission.")
        setIsLoading(false)
      })
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Camera Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">{error}</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={retryCamera} variant="outline">
                Retry Camera Access
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn("h-full w-full object-cover", (isLoading || error) && "hidden")}
          />

          <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full opacity-0" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {processingEnabled ? "Processing video frames..." : "Camera ready"}
        </p>
      </CardFooter>
    </Card>
  )
}

