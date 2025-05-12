import jwt from "jsonwebtoken"
import { supabase } from "../config/db.js"
import bcrypt from "bcryptjs"

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register and POST /register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      res.status(400)
      throw new Error("User already exists")
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
      return res.status(500).json({ message: "Failed to create user" })
    }

    // Generate JWT token
    const token = generateToken(newUser[0].id)

    // Return user data and token
    res.status(201).json({
      _id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      token,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login and POST /login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check for user email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      res.status(401)
      throw new Error("Invalid email or password")
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      res.status(401)
      throw new Error("Invalid email or password")
    }

    // Generate JWT token
    const token = generateToken(user.id)

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token,
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await supabase.from("users").select("id, name, email, created_at").eq("id", req.user._id).single()

    if (user.error || !user.data) {
      res.status(404)
      throw new Error("User not found")
    }

    res.json({
      _id: user.data.id,
      name: user.data.name,
      email: user.data.email,
      createdAt: user.data.created_at,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
