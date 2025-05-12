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

    // Get user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .eq("id", decoded.id)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data
    return NextResponse.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    })
  } catch (error) {
    console.error("Auth error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
