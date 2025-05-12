"use client"

import { useState, useCallback } from "react"
import { translateText } from "@/actions/translation"

export type TranslationSettings = {
  enabled: boolean
  userLanguage: string
  partnerLanguage: string
  autoDetect: boolean
}

export function useTranslation(initialSettings?: Partial<TranslationSettings>) {
  const [settings, setSettings] = useState<TranslationSettings>({
    enabled: true,
    userLanguage: "English",
    partnerLanguage: "Japanese",
    autoDetect: true,
    ...initialSettings,
  })

  const [isTranslating, setIsTranslating] = useState(false)

  const toggleTranslation = useCallback(() => {
    setSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
  }, [])

  const updateSettings = useCallback((newSettings: Partial<TranslationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  const translateMessage = useCallback(
    async (text: string, targetLanguage?: string) => {
      if (!settings.enabled || !text.trim()) {
        return { translatedText: text, success: true }
      }

      setIsTranslating(true)
      try {
        const target = targetLanguage || settings.partnerLanguage

        console.log("Calling translation API with:", { text, targetLanguage: target })
        const result = await translateText(text, target)
        console.log("Translation result:", result)

        return result
      } catch (error) {
        console.error("Translation error:", error)
        return { translatedText: text, success: false, error: "Translation failed" }
      } finally {
        setIsTranslating(false)
      }
    },
    [settings],
  )

  return {
    settings,
    isTranslating,
    toggleTranslation,
    updateSettings,
    translateMessage,
  }
}
