import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()

    if (error || !newUser || newUser.length === 0) {
      console.error("Error creating user:", error)
      return NextResponse.json({ message: "Failed to create user", errorMsg: error }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "30d" },
    )

    // Return user data and token
    return NextResponse.json({
      _id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
