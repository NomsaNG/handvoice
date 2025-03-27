"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Pause, Play, RefreshCw, Volume2 } from "lucide-react"
import { CameraFeed } from "@/components/camera-feed"
import { useSignTranslator } from "@/hooks/use-sign-translator"

export default function AdvancedTranslatePage() {
  const [activeTab, setActiveTab] = useState("sign-to-text")
  const [inputText, setInputText] = useState("")
  const [isGeneratingSign, setIsGeneratingSign] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { addDetection, translatedText, isTranslating, toggleTranslation, reset, recentSigns } = useSignTranslator()

  // Handle video frame processing
  const handleVideoFrame = async (imageData: ImageData) => {
    if (!isTranslating) return

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
        addDetection(data.result)
      }
    } catch (error) {
      console.error("Error processing video frame:", error)
    }
  }

  const handleTextToSignTranslation = async () => {
    if (!inputText.trim()) return

    setIsGeneratingSign(true)

    try {
      // In a real implementation, you would:
      // 1. Call an API to generate sign language animations
      // 2. Display the animations on the canvas

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, just show a message
      setIsGeneratingSign(false)
    } catch (error) {
      console.error("Error generating sign language:", error)
      setIsGeneratingSign(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
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

  // Reset when changing tabs
  useEffect(() => {
    reset()
    setInputText("")
    setIsGeneratingSign(false)
  }, [activeTab, reset])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Advanced Sign Language Translator</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-to-text">Sign to Text</TabsTrigger>
          <TabsTrigger value="text-to-sign">Text to Sign</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-to-text" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CameraFeed onFrame={handleVideoFrame} processingEnabled={isTranslating} />

            <Card>
              <CardHeader>
                <CardTitle>Translation Output</CardTitle>
                <CardDescription>Real-time translation of your sign language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[200px] rounded-md border p-4">
                  {translatedText ? (
                    <p className="text-lg">{translatedText}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      {isTranslating ? "Waiting for sign language input..." : "Start translation to see results here"}
                    </p>
                  )}
                </div>

                {recentSigns.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detected signs:</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSigns.map((sign, index) => (
                        <Badge key={index} variant="secondary">
                          {sign}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={toggleTranslation} variant={isTranslating ? "destructive" : "default"}>
                  {isTranslating ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Translation
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Translation
                    </>
                  )}
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
        </TabsContent>

        <TabsContent value="text-to-sign" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Text Input</CardTitle>
                <CardDescription>Enter text to translate to sign language</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px]"
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleTextToSignTranslation}
                  disabled={!inputText.trim() || isGeneratingSign}
                  className="ml-auto"
                >
                  {isGeneratingSign ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Translate to Sign Language"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sign Language Output</CardTitle>
                <CardDescription>Visual representation of the sign language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  {isGeneratingSign ? (
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                      <p>Generating sign language visualization...</p>
                    </div>
                  ) : inputText ? (
                    <canvas ref={canvasRef} className="w-full h-full" />
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Enter text and click translate to see sign language
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {inputText && !isGeneratingSign ? `Showing sign language for: "${inputText}"` : ""}
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

