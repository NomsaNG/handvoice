"use client"

import { useState, useCallback, useEffect } from "react"

interface SignDetection {
  text: string
  confidence: number
}

interface UseSignTranslatorProps {
  confidenceThreshold?: number
  debounceTime?: number
}

export function useSignTranslator({ confidenceThreshold = 0.8, debounceTime = 1000 }: UseSignTranslatorProps = {}) {
  const [detections, setDetections] = useState<SignDetection[]>([])
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [recentSigns, setRecentSigns] = useState<string[]>([])

  // Add a new detection
  const addDetection = useCallback(
    (detection: SignDetection) => {
      if (detection.confidence >= confidenceThreshold) {
        setDetections((prev) => [...prev, detection])
      }
    },
    [confidenceThreshold],
  )

  // Process detections to form coherent text
  useEffect(() => {
    if (!isTranslating || detections.length === 0) return

    // Get unique signs from recent detections
    const recentDetections = detections.slice(-10)
    const highConfidenceDetections = recentDetections.filter((d) => d.confidence >= confidenceThreshold)

    // Extract unique signs (avoid repetition)
    const uniqueSigns = Array.from(new Set(highConfidenceDetections.map((d) => d.text)))

    // Update recent signs
    setRecentSigns(uniqueSigns)

    // Form a sentence from the unique signs
    // In a real app, you would use NLP to form grammatically correct sentences
    const sentence = uniqueSigns.join(" ")

    // Debounce the update to avoid too frequent changes
    const timer = setTimeout(() => {
      setTranslatedText(sentence)
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [detections, isTranslating, confidenceThreshold, debounceTime])

  // Start/stop translation
  const toggleTranslation = useCallback(() => {
    setIsTranslating((prev) => !prev)
    if (isTranslating) {
      // Reset when stopping
      setDetections([])
      setRecentSigns([])
      setTranslatedText("")
    }
  }, [isTranslating])

  // Reset everything
  const reset = useCallback(() => {
    setDetections([])
    setRecentSigns([])
    setTranslatedText("")
    setIsTranslating(false)
  }, [])

  return {
    addDetection,
    translatedText,
    isTranslating,
    toggleTranslation,
    reset,
    recentSigns,
  }
}

