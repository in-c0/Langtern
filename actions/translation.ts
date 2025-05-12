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

    // Map the target language to the expected format (e.g., "English" -> "en")
    const targetLang = mapLanguageToCode(targetLanguage)

    // Call the translation API
    const result = await apiTranslateText({
      text,
      targetLang,
    })

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
    // In a real implementation, you might want to call the translation API with a special flag
    // or implement client-side detection
    return "auto-detected"
  } catch (error) {
    console.error("Language detection error:", error)
    return "unknown"
  }
}

// Helper function to map full language names to language codes
function mapLanguageToCode(language: string): string {
  const languageMap: Record<string, string> = {
    English: "en",
    Japanese: "ja",
    Spanish: "es",
    French: "fr",
    German: "de",
    Chinese: "zh",
    Korean: "ko",
    Portuguese: "pt",
    Italian: "it",
    Russian: "ru",
    // Add more mappings as needed
  }

  return languageMap[language] || "en" // Default to English if not found
}
