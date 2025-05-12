"use server"

import { aiApi } from "@/services/api"

type TranslationResult = {
  translatedText: string
  detectedLanguage?: string
  success: boolean
  error?: string
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string,
): Promise<TranslationResult> {
  try {
    // Skip translation for empty messages
    if (!text.trim()) {
      return { translatedText: text, success: true }
    }

    // Use the API service for translation
    const result = await aiApi.translate(text, targetLanguage, sourceLanguage)

    return {
      translatedText: result.translatedText || text,
      success: true,
      detectedLanguage: sourceLanguage || "auto-detected",
    }
  } catch (error) {
    console.error("Translation error:", error)
    return {
      translatedText: text,
      success: false,
      error: "Failed to translate text. Using original message.",
    }
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    // Skip detection for empty messages
    if (!text.trim()) {
      return "unknown"
    }

    // For now, we'll just return a placeholder as the backend doesn't have a separate detect endpoint
    // In a real implementation, we could use the translation API to detect the language
    return "auto-detected"
  } catch (error) {
    console.error("Language detection error:", error)
    return "unknown"
  }
}
