"use client"

import { useState, useCallback } from "react"

export interface TranslationSettings {
  userLanguage: string
  partnerLanguage: string
  enabled?: boolean
  autoDetect?: boolean
}

export function useTranslation(initialSettings: TranslationSettings) {
  const [settings, setSettings] = useState<TranslationSettings>({
    userLanguage: initialSettings.userLanguage || "English",
    partnerLanguage: initialSettings.partnerLanguage || "Japanese",
    enabled: initialSettings.enabled !== undefined ? initialSettings.enabled : true,
    autoDetect: initialSettings.autoDetect !== undefined ? initialSettings.autoDetect : true,
  })

  const [isTranslating, setIsTranslating] = useState(false)

  const updateSettings = useCallback((newSettings: Partial<TranslationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  return {
    settings,
    isTranslating,
    updateSettings,
  }
}
