"use client"

import { useState, useEffect, useCallback } from "react"
import { CameraFeed } from "@/components/camera-feed"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Volume2 } from "lucide-react"
import type { SignDetectionResult } from "@/lib/azure-ai-service"

interface SignLanguageProcessorProps {
  onTranslationUpdate?: (text: string) => void
}

export function SignLanguageProcessor({ onTranslationUpdate }: SignLanguageProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectedSigns, setDetectedSigns] = useState<SignDetectionResult[]>([])
  const [translatedText, setTranslatedText] = useState("")

  // Process detected signs to form coherent sentences
  useEffect(() => {
    if (detectedSigns.length === 0) return

    // Get the most recent sign with high confidence
    const recentSigns = detectedSigns.slice(-5)
    const highConfidenceSigns = recentSigns.filter((sign) => sign.confidence > 0.8)

    if (highConfidenceSigns.length > 0) {
      // In a real app, we would use more sophisticated NLP to form proper sentences
      const newText = highConfidenceSigns.map((sign) => sign.text).join(" ")
      setTranslatedText(newText)

      if (onTranslationUpdate) {
        onTranslationUpdate(newText)
      }
    }
  }, [detectedSigns, onTranslationUpdate])

  const handleVideoFrame = useCallback(
    async (imageData: ImageData) => {
      if (!isProcessing) return

      try {
        // Convert the ImageData to a Blob
        const canvas = document.createElement("canvas")
        canvas.width = imageData.width
        canvas.height = imageData.height
        const ctx = canvas.getContext("2d")

        if (!ctx) return

        ctx.putImageData(imageData, 0, 0)

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob)
          }, "image/jpeg")
        })

        // Create form data
        const formData = new FormData()
        formData.append("image", blob, "sign-language.jpg")

        // Send to our API
        const response = await fetch("/api/process-sign", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to process sign language")
        }

        const data = await response.json()

        if (data.result) {
          setDetectedSigns((prev) => [...prev, data.result])
        }
      } catch (error) {
        console.error("Error processing video frame:", error)
      }
    },
    [isProcessing],
  )

  const toggleProcessing = () => {
    setIsProcessing((prev) => !prev)
    if (!isProcessing) {
      // Clear previous results when starting new session
      setDetectedSigns([])
      setTranslatedText("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        // Could show a toast notification here
        console.log("Text copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const speakText = () => {
    if ("speechSynthesis" in window && translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <CameraFeed onFrame={handleVideoFrame} processingEnabled={isProcessing} />

      <Card>
        <CardHeader>
          <CardTitle>Translation Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] rounded-md border p-4">
            {translatedText ? (
              <p>{translatedText}</p>
            ) : (
              <p className="text-muted-foreground">
                {isProcessing ? "Waiting for sign language input..." : "Start translation to see results here"}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={toggleProcessing} variant={isProcessing ? "destructive" : "default"}>
            {isProcessing ? "Stop Translation" : "Start Translation"}
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={speakText} disabled={!translatedText}>
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!translatedText}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

