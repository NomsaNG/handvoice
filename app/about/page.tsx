import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, CloudCog, Database, Fingerprint, Github, Layers, Camera } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About SignAI Translator</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Breaking communication barriers with artificial intelligence
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4">
              SignAI Translator aims to bridge the communication gap between the deaf and hearing communities by
              leveraging cutting-edge AI technology. Our mission is to make communication more accessible and inclusive
              for everyone.
            </p>
            <p>
              According to the World Health Organization, over 5% of the world's population – 430 million people –
              require rehabilitation to address their 'disabling' hearing loss. Our tool helps break down these barriers
              by providing real-time, accurate sign language translation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Video Capture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our application captures video input through your device's camera, processing the visual data in
                    real-time to identify sign language gestures.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Using Azure's advanced AI services, we analyze the video frames to detect hand shapes, movements,
                    and facial expressions that constitute sign language.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Language Model
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our custom-trained language model interprets the detected signs and translates them into written
                    text, understanding context and grammar.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Two-way Translation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Beyond sign-to-text, our system can also convert written text into visual sign language
                    representations, enabling two-way communication.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CloudCog className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Azure AI Services</h3>
                  <p className="text-muted-foreground">
                    We leverage Azure Custom Vision, Azure Cognitive Services, and Azure Machine Learning to power our
                    AI translation capabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Fingerprint className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Computer Vision</h3>
                  <p className="text-muted-foreground">
                    Advanced computer vision algorithms detect and track hand movements, positions, and gestures in
                    real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Github className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Open Source</h3>
                  <p className="text-muted-foreground">
                    Our project is built with open-source technologies and frameworks, including Next.js, TensorFlow.js,
                    and the Azure AI SDK.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Azure AI Developer Hackathon</h2>
            <p className="mb-4">
              This project was developed for the Azure AI Developer Hackathon 2025, showcasing the potential of Azure's
              AI services to create impactful solutions that address real-world challenges.
            </p>
            <div className="flex justify-center mt-8">
              <Link href="/translate">
                <Button size="lg" className="gap-2">
                  Try the Translator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

