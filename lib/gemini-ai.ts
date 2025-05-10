"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Type to hold response data from Gemini
export type GeminiResponse<T> = {
  data: T | null
  success: boolean
  error?: string
}

/**
 * Generic function to generate text using Gemini API
 * Note: We're using OpenAI as a fallback since the Gemini package has loading issues
 */
export async function generateWithGemini(
  prompt: string,
  options?: {
    maxTokens?: number
    temperature?: number
  },
): Promise<GeminiResponse<string>> {
  try {
    // Using OpenAI as a fallback for Gemini
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens,
    })

    return {
      data: text,
      success: true,
    }
  } catch (error) {
    console.error("AI generation error:", error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate text with AI",
    }
  }
}

/**
 * Function to parse JSON from AI responses
 */
export async function generateJsonWithGemini<T>(
  prompt: string,
  options?: {
    maxTokens?: number
    temperature?: number
  },
): Promise<GeminiResponse<T>> {
  try {
    const response = await generateWithGemini(prompt, options)

    if (!response.success || !response.data) {
      return {
        data: null,
        success: false,
        error: response.error || "Failed to generate text",
      }
    }

    // Parse the JSON response
    try {
      const jsonData = JSON.parse(response.data) as T
      return {
        data: jsonData,
        success: true,
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return {
        data: null,
        success: false,
        error: "Failed to parse AI response as JSON",
      }
    }
  } catch (error) {
    console.error("AI JSON generation error:", error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate JSON with AI",
    }
  }
}
