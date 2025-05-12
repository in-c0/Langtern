import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import jwt from "jsonwebtoken"

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }

    // Get user's conversations
    const { data: participations, error: participationsError } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", decoded.id)

    if (participationsError) {
      return NextResponse.json({ message: "Failed to fetch conversations" }, { status: 500 })
    }

    const conversationIds = participations.map((p) => p.conversation_id)

    if (conversationIds.length === 0) {
      return NextResponse.json([])
    }

    // Get conversations with participants and latest message
    const { data: conversations, error: conversationsError } = await supabase
      .from("conversations")
      .select(`
        id, created_at,
        conversation_participants(user_id, users(id, name, email, profile_image_url))
      `)
      .in("id", conversationIds)
      .order("created_at", { ascending: false })

    if (conversationsError) {
      return NextResponse.json({ message: "Failed to fetch conversation details" }, { status: 500 })
    }

    // Get latest message for each conversation
    const conversationsWithLatestMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: latestMessage } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        // Filter out the current user from participants
        const otherParticipants = conversation.conversation_participants.filter((p: any) => p.user_id !== decoded.id)

        return {
          id: conversation.id,
          created_at: conversation.created_at,
          participants: otherParticipants.map((p: any) => p.users),
          latest_message: latestMessage || null,
        }
      }),
    )

    return NextResponse.json(conversationsWithLatestMessage)
  } catch (error) {
    console.error("Conversations fetch error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Not authorized, no token" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }

    // Get conversation data from request
    const { participant_ids } = await request.json()

    if (!participant_ids || !Array.isArray(participant_ids) || participant_ids.length === 0) {
      return NextResponse.json({ message: "At least one participant ID is required" }, { status: 400 })
    }

    // Create a new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single()

    if (conversationError || !conversation) {
      return NextResponse.json({ message: "Failed to create conversation" }, { status: 500 })
    }

    // Add all participants including the current user
    const allParticipantIds = [...new Set([...participant_ids, decoded.id])]

    const participantsToInsert = allParticipantIds.map((userId) => ({
      conversation_id: conversation.id,
      user_id: userId,
    }))

    const { error: participantsError } = await supabase.from("conversation_participants").insert(participantsToInsert)

    if (participantsError) {
      return NextResponse.json({ message: "Failed to add participants" }, { status: 500 })
    }

    return NextResponse.json({
      id: conversation.id,
      created_at: conversation.created_at,
      participants: allParticipantIds,
    })
  } catch (error) {
    console.error("Conversation create error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
