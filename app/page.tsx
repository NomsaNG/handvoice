import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Camera, MessageSquareText, Repeat } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">SignAI</span>
            <span>Translator</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/translate">
              <Button>Start Translating</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container flex-1 py-12 md:py-24 lg:py-32">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Breaking Barriers in Communication
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our AI-powered sign language translator bridges the gap between sign language users and the hearing
                world, making communication accessible for everyone.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/translate">
                <Button size="lg" className="gap-2">
                  Start Translating <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Sign language translation illustration"
              className="aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card>
            <CardHeader>
              <Camera className="h-12 w-12 text-primary" />
              <CardTitle>Real-time Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced computer vision technology captures and processes sign language gestures in real-time with high
                accuracy.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageSquareText className="h-12 w-12 text-primary" />
              <CardTitle>Accurate Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Our AI model translates American Sign Language (ASL) to text with high precision, trained on thousands
                of sign language examples.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Repeat className="h-12 w-12 text-primary" />
              <CardTitle>Two-way Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Not only translate sign language to text, but also convert text back to visual sign language
                representations.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 text-center md:text-left">
            <div className="text-lg font-medium">SignAI Translator</div>
            <div className="text-sm text-muted-foreground">Breaking barriers in communication with AI</div>
          </div>
          <div className="flex-1 text-center md:text-right">
            <p className="text-sm text-muted-foreground">Built for Azure AI Developer Hackathon 2025</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

