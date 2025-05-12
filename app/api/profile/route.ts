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

    // Get user profile with languages and skills
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(`
        id, name, email, bio, profile_image_url, created_at,
        user_languages(*, languages(*)),
        user_skills(*, skills(*))
      `)
      .eq("id", decoded.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile fetch error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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

    // Get profile data from request
    const { name, bio, profile_image_url } = await request.json()

    // Update user profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update({ name, bio, profile_image_url, updated_at: new Date() })
      .eq("id", decoded.id)
      .select()

    if (updateError) {
      return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error("Profile update error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
