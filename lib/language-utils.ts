// Common language codes and names mapping
export const LANGUAGE_MAP = {
  en: "English",
  ja: "Japanese",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  ko: "Korean",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  ar: "Arabic",
}

// Function to get language name from code
export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code.toLowerCase()] || code
}

// Function to get language code from name
export function getLanguageCode(name: string): string {
  const entries = Object.entries(LANGUAGE_MAP)
  const found = entries.find(([_, langName]) => langName.toLowerCase() === name.toLowerCase())
  return found ? found[0] : name.toLowerCase()
}

// Function to detect if text contains non-Latin characters (simplified detection)
export function containsNonLatinCharacters(text: string): boolean {
  // This regex checks for common non-Latin character ranges
  const nonLatinRegex = /[^\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]/
  return nonLatinRegex.test(text)
}

// Function to make a best guess at the language based on characters (very simplified)
export function guessLanguageFromText(text: string): string {
  // Japanese characters (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text)) {
    return "Japanese"
  }

  // Chinese characters (simplified and traditional)
  if (/[\u4e00-\u9fff]/.test(text) && !/[\u3040-\u30ff]/.test(text)) {
    return "Chinese"
  }

  // Korean characters (Hangul)
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) {
    return "Korean"
  }

  // Cyrillic (Russian and other Slavic languages)
  if (/[\u0400-\u04FF]/.test(text)) {
    return "Russian"
  }

  // Arabic characters
  if (/[\u0600-\u06FF]/.test(text)) {
    return "Arabic"
  }

  // Default to English for Latin-based text
  return "English"
}
