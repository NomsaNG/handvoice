"use server"

import { AzureKeyCredential } from "@azure/core-auth"
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision"

// This is a server-side module that will handle the Azure Computer Vision API calls
export class AzureVisionClient {
  private client: ComputerVisionClient

  constructor() {
    const endpoint = process.env.AZURE_AI_ENDPOINT
    const apiKey = process.env.AZURE_AI_API_KEY

    if (!endpoint || !apiKey) {
      throw new Error("Azure AI endpoint and API key are required")
    }

    this.client = new ComputerVisionClient(new AzureKeyCredential(apiKey), endpoint)
  }

  /**
   * Analyze an image for hand gestures and posture
   * @param imageUrl URL of the image to analyze
   */
  async analyzeImage(imageUrl: string) {
    try {
      // Analyze the image for objects and tags
      const results = await this.client.analyzeImage(imageUrl, {
        visualFeatures: ["Objects", "Tags"],
      })

      // Extract hand-related objects and tags
      const handObjects =
        results.objects?.filter(
          (obj) => obj.object.toLowerCase().includes("hand") || obj.object.toLowerCase().includes("finger"),
        ) || []

      const handTags =
        results.tags?.filter(
          (tag) =>
            tag.name.toLowerCase().includes("hand") ||
            tag.name.toLowerCase().includes("finger") ||
            tag.name.toLowerCase().includes("gesture"),
        ) || []

      return {
        handObjects,
        handTags,
        allObjects: results.objects || [],
        allTags: results.tags || [],
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      throw error
    }
  }
}

// Create a singleton instance
let azureVisionClient: AzureVisionClient | null = null

export function getAzureVisionClient(): AzureVisionClient {
  if (!azureVisionClient) {
    azureVisionClient = new AzureVisionClient()
  }

  return azureVisionClient
}

