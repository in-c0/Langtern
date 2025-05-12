import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }

    // Check if user is a participant in this conversation
    const { data: participant, error: participantError } = await supabase
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", decoded.id)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ message: "You are not a participant in this conversation" }, { status: 403 })
    }

    // Get messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        *,
        sender:sender_id(id, name, email, profile_image_url),
        original_language:original_language_id(id, name, code)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (messagesError) {
      return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages fetch error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }

    // Check if user is a participant in this conversation
    const { data: participant, error: participantError } = await supabase
      .from("conversation_participants")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("user_id", decoded.id)
      .single()

    if (participantError || !participant) {
      return NextResponse.json({ message: "You are not a participant in this conversation" }, { status: 403 })
    }

    // Get message data from request
    const { content, language_id } = await request.json()

    if (!content) {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 })
    }

    // Create a new message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: decoded.id,
        content,
        original_language_id: language_id,
      })
      .select()
      .single()

    if (messageError || !message) {
      return NextResponse.json({ message: "Failed to create message" }, { status: 500 })
    }

    // Get sender details
    const { data: sender } = await supabase
      .from("users")
      .select("id, name, email, profile_image_url")
      .eq("id", decoded.id)
      .single()

    // Get language details if provided
    let language = null
    if (language_id) {
      const { data: languageData } = await supabase
        .from("languages")
        .select("id, name, code")
        .eq("id", language_id)
        .single()

      language = languageData
    }

    // Use Gemini to check message tone and provide feedback
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    Analyze the tone and clarity of this message in a professional context:
    "${content}"

    Provide a very brief assessment (1-2 sentences) of whether the message is:
    1. Clear and professional
    2. Could be improved for clarity
    3. Potentially confusing or inappropriate

    Only return your brief assessment, nothing else.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const toneAnalysis = response.text().trim()

    return NextResponse.json({
      ...message,
      sender,
      original_language: language,
      tone_analysis: toneAnalysis,
    })
  } catch (error) {
    console.error("Message create error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
