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

    // Get user's applications
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        jobs(*,
          companies(*),
          job_languages(*, languages(*)),
          job_skills(*, skills(*))
        )
      `)
      .eq("user_id", decoded.id)

    if (error) {
      return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Applications fetch error:", error)

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

    // Get application data from request
    const { job_id, cover_letter } = await request.json()

    if (!job_id) {
      return NextResponse.json({ message: "Job ID is required" }, { status: 400 })
    }

    // Create application
    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: decoded.id,
        job_id,
        cover_letter,
        status: "pending",
      })
      .select()

    if (error) {
      return NextResponse.json({ message: "Failed to create application" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Application create error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
