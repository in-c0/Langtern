"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Languages } from "lucide-react"
import api from "@/services/api"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "Japanese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
]

export function TranslationTester() {
  const [inputText, setInputText] = useState("")
  const [targetLang, setTargetLang] = useState("ja")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)
    setError(null)

    try {
      const result = await api.ai.translate(inputText, targetLang)
      setTranslatedText(result.translatedText || "")
    } catch (error) {
      console.error("Translation error:", error)
      setError(error instanceof Error ? error.message : "Translation failed")
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Languages className="h-5 w-5 text-blue-500" />
          Translation Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="input-text" className="text-sm font-medium">
            Text to translate
          </label>
          <Textarea
            id="input-text"
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="target-lang" className="text-sm font-medium">
            Target language
          </label>
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger id="target-lang">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {translatedText && (
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Translation</label>
            <div className="p-3 bg-muted rounded-md">
              <p>{translatedText}</p>
            </div>
          </div>
        )}

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()} className="w-full">
          {isTranslating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
