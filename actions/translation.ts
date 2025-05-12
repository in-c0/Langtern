"use server"

import { translateText as apiTranslateText } from "@/lib/api-service"

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

    console.log("Server action: translating text", { text, targetLanguage })

    // Call the translation API with the full language name
    const result = await apiTranslateText({
      text,
      targetLang: targetLanguage, // Use the full language name directly
    })

    console.log("Translation API result:", result)

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

    // For now, we'll return a default value since the API doesn't have a dedicated language detection endpoint
    return "auto-detected"
  } catch (error) {
    console.error("Language detection error:", error)
    return "unknown"
  }
}
