import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ message: "Text and target language are required" }, { status: 400 })
    }

    // Use Gemini AI for translation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    Translate the following text ${sourceLanguage ? `from ${sourceLanguage}` : ""} to ${targetLanguage}. 
    Maintain the original meaning, tone, and formatting as closely as possible.
    Only return the translated text without any explanations or additional text.

    Text to translate:
    "${text}"
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text().trim()

    return NextResponse.json({
      originalText: text,
      translatedText,
      sourceLanguage: sourceLanguage || "auto-detected",
      targetLanguage,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ message: "Translation failed" }, { status: 500 })
  }
}
