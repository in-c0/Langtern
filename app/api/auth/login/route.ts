import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    console.log(user)

    if (error || !user) {
      return NextResponse.json({ message: "Invalid email or password?", users: user, erorr: error }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password!", password: password, passwordU: user.password },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "30d",
    })

    // Return user data and token
    return NextResponse.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
