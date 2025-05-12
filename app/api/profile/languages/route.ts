import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import jwt from "jsonwebtoken"

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

    // Get language data from request
    const { language_id, proficiency_level } = await request.json()

    if (!language_id || !proficiency_level) {
      return NextResponse.json({ message: "Language ID and proficiency level are required" }, { status: 400 })
    }

    // Add language to user profile
    const { data, error } = await supabase
      .from("user_languages")
      .upsert({
        user_id: decoded.id,
        language_id,
        proficiency_level,
      })
      .select()

    if (error) {
      return NextResponse.json({ message: "Failed to add language" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Language add error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
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

    const url = new URL(request.url)
    const languageId = url.searchParams.get("language_id")

    if (!languageId) {
      return NextResponse.json({ message: "Language ID is required" }, { status: 400 })
    }

    // Remove language from user profile
    const { error } = await supabase
      .from("user_languages")
      .delete()
      .eq("user_id", decoded.id)
      .eq("language_id", languageId)

    if (error) {
      return NextResponse.json({ message: "Failed to remove language" }, { status: 500 })
    }

    return NextResponse.json({ message: "Language removed successfully" })
  } catch (error) {
    console.error("Language remove error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
