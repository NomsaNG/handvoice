"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Camera, Copy, Pause, Play, RefreshCw, Volume2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export default function TranslatePage() {
  const [activeTab, setActiveTab] = useState("sign-to-text")
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [inputText, setInputText] = useState("")
  const [isCameraReady, setIsCameraReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()

  // Handle camera setup
  useEffect(() => {
    if (activeTab === "sign-to-text") {
      setupCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [activeTab])

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraReady(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCameraReady(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraReady(false)
    }
  }

  const toggleTranslation = () => {
    if (isTranslating) {
      setIsTranslating(false)
      // Stop the translation process
    } else {
      setIsTranslating(true)
      if (activeTab === "sign-to-text") {
        startSignToTextTranslation()
      } else {
        startTextToSignTranslation()
      }
    }
  }

  const startSignToTextTranslation = () => {
    // In a real implementation, this would:
    // 1. Capture frames from the video
    // 2. Process them with Azure Custom Vision or Azure Cognitive Services
    // 3. Update the translated text state with the results

    // Simulating translation for demo purposes
    const demoTexts = ["Hello, how are you?", "My name is John.", "Nice to meet you.", "Thank you for your help."]

    let index = 0
    const interval = setInterval(() => {
      setTranslatedText(demoTexts[index % demoTexts.length])
      index++
    }, 3000)

    // Store the interval ID to clear it when stopping
    return () => clearInterval(interval)
  }

  const startTextToSignTranslation = () => {
    // In a real implementation, this would:
    // 1. Process the input text
    // 2. Use Azure AI to generate sign language animations or retrieve videos
    // 3. Display the sign language representation

    // For demo purposes, we'll just acknowledge the text was processed
    setTranslatedText(`Translating: "${inputText}" to sign language`)
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
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Sign Language Translator</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-to-text">Sign to Text</TabsTrigger>
          <TabsTrigger value="text-to-sign">Text to Sign</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-to-text" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Camera Input</CardTitle>
                <CardDescription>Position your hands in the frame and sign clearly</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn("h-full w-full object-cover", !isCameraReady && "hidden")}
                  />
                  {!isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Camera not available</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="camera-switch" checked={isTranslating} onCheckedChange={toggleTranslation} />
                  <Label htmlFor="camera-switch">{isTranslating ? "Translating" : "Start Translation"}</Label>
                </div>
                <Button variant="outline" size="icon" onClick={toggleTranslation}>
                  {isTranslating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Translation Output</CardTitle>
                <CardDescription>Real-time translation of your sign language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] rounded-md border p-4">
                  {translatedText ? (
                    <p>{translatedText}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      {isTranslating ? "Waiting for sign language input..." : "Start translation to see results here"}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={speakText} disabled={!translatedText}>
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!translatedText}>
                  <Copy className="h-4 w-4" />
                </Button>
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
                <Button onClick={toggleTranslation} disabled={!inputText.trim()} className="ml-auto">
                  Translate to Sign Language
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
                  {isTranslating ? (
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                      <p>Generating sign language visualization...</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Enter text and click translate to see sign language
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{translatedText}</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

