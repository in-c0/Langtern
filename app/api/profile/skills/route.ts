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

    // Get skill data from request
    const { skill_id, proficiency_level } = await request.json()

    if (!skill_id) {
      return NextResponse.json({ message: "Skill ID is required" }, { status: 400 })
    }

    // Add skill to user profile
    const { data, error } = await supabase
      .from("user_skills")
      .upsert({
        user_id: decoded.id,
        skill_id,
        proficiency_level,
      })
      .select()

    if (error) {
      return NextResponse.json({ message: "Failed to add skill" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Skill add error:", error)

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
    const skillId = url.searchParams.get("skill_id")

    if (!skillId) {
      return NextResponse.json({ message: "Skill ID is required" }, { status: 400 })
    }

    // Remove skill from user profile
    const { error } = await supabase.from("user_skills").delete().eq("user_id", decoded.id).eq("skill_id", skillId)

    if (error) {
      return NextResponse.json({ message: "Failed to remove skill" }, { status: 500 })
    }

    return NextResponse.json({ message: "Skill removed successfully" })
  } catch (error) {
    console.error("Skill remove error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
