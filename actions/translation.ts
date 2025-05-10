"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

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

    let prompt = ""

    if (sourceLanguage) {
      prompt = `Translate the following ${sourceLanguage} text to ${targetLanguage}:\n\n"${text}"\n\nTranslation:`
    } else {
      prompt = `Detect the language of the following text and translate it to ${targetLanguage}:\n\n"${text}"\n\nTranslation:`
    }

    const { text: translatedText } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.3,
      maxTokens: 1000,
    })

    return {
      translatedText: translatedText.trim(),
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

    const prompt = `Detect the language of the following text. Respond with only the language name (e.g., "English", "Japanese", "Spanish"):\n\n"${text}"`

    const { text: detectedLanguage } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.1,
      maxTokens: 50,
    })

    return detectedLanguage.trim()
  } catch (error) {
    console.error("Language detection error:", error)
    return "unknown"
  }
}
