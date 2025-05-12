import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import { loginUser, registerUser } from "./controllers/authController.js"
import { searchUsers } from "./controllers/searchController.js"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Load environment variables
dotenv.config()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
// Connect to database

const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
  }),
)

// Direct routes at root level
app.post("/login", loginUser)
app.post("/register", registerUser)
app.get("/search", searchUsers)

app.post("/translate", async (req, res) => {
  const { text, targetLang } = req.body

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or target language" })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    Translate the following text to ${targetLang}. 
    Only return the translated text without any explanations or additional text.

    Text to translate:
    "${text}"
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text().trim()

    res.json({
      originalText: text,
      translatedText,
      targetLanguage: targetLang,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Translation failed" })
  }
})

app.post("/searchJob", async (req, res) => {
  const supabase = await connectDB()
  const { searchValue, skills, languages } = req.body

  if (!searchValue && (!skills || !languages)) {
    return res.status(400).json({ error: "Missing search criteria" })
  }

  try {
    // Get jobs from database
    let query = supabase.from("jobs").select(`
      *,
      companies(*),
      job_languages(*, languages(*)),
      job_skills(*, skills(*))
    `)

    // Apply filters if provided
    if (searchValue) {
      query = query.or(`country.ilike.%${searchValue}%,city.ilike.%${searchValue}%,title.ilike.%${searchValue}%`)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // If no skills or languages provided, return all jobs
    if (!skills && !languages) {
      return res.json({ response: data })
    }

    // Use Gemini to find the best matches
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    I need your help finding the best possible job options from the options below. 
    Please find jobs that match some if not all the info set by the user. 
    Only return the jobs as a JSON Array, do not return anything else.

    User information:
    Skills: ${skills || "Not specified"}
    Languages: ${languages || "Not specified"}

    Here are all the jobs, they are in JSON format:
    ${JSON.stringify(data)}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()

    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)?.[0] || "[]"
    let matchedJobs

    try {
      matchedJobs = JSON.parse(jsonMatch)
    } catch (e) {
      console.error("Failed to parse AI response:", e)
      matchedJobs = data // Fallback to all jobs if parsing fails
    }

    res.json({
      response: matchedJobs,
      originalJobs: data,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Job search failed" })
  }
})

// API routes under /api prefix
app.use("/api/auth", authRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
