import { NextResponse } from "next/server"
import { supabase } from "@/config/db"
import jwt from "jsonwebtoken"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

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
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select(`
        id, name, email,
        user_languages(*, languages(*)),
        user_skills(*, skills(*))
      `)
      .eq("id", decoded.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 })
    }

    // Get all available jobs with their requirements
    const { data: jobs, error: jobsError } = await supabase.from("jobs").select(`
      *,
      companies(*),
      job_languages(*, languages(*)),
      job_skills(*, skills(*))
    `)

    if (jobsError) {
      return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 })
    }

    // Extract user languages and skills
    const userLanguages = userProfile.user_languages.map((ul: any) => ({
      name: ul.languages.name,
      code: ul.languages.code,
      proficiency: ul.proficiency_level,
    }))

    const userSkills = userProfile.user_skills.map((us: any) => ({
      name: us.skills.name,
      proficiency: us.proficiency_level,
    }))

    // Use Gemini AI to find the best matches
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    I need to match a user with the most suitable jobs based on their language skills and other skills.

    User Profile:
    Languages: ${JSON.stringify(userLanguages)}
    Skills: ${JSON.stringify(userSkills)}

    Available Jobs:
    ${JSON.stringify(jobs)}

    Please analyze the jobs and rank the top 5 most suitable matches for this user based on:
    1. Language match (most important)
    2. Skill match
    3. Job type and location compatibility

    Return ONLY a JSON array with the job IDs and a match score (0-100) and brief reason, like:
    [
      {"id": 3, "score": 95, "reason": "Perfect language match (native Japanese) and has required skills"},
      {"id": 1, "score": 80, "reason": "Good language match but missing some skills"}
    ]
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)?.[0] || "[]"
    const matches = JSON.parse(jsonMatch)

    // Get the full job details for the matched jobs
    const matchedJobs = jobs.filter((job: any) => matches.some((match: any) => match.id === job.id))

    // Combine the job details with the match information
    const enrichedMatches = matchedJobs.map((job: any) => {
      const match = matches.find((m: any) => m.id === job.id)
      return {
        ...job,
        match_score: match.score,
        match_reason: match.reason,
      }
    })

    // Sort by match score
    enrichedMatches.sort((a: any, b: any) => b.match_score - a.match_score)

    return NextResponse.json(enrichedMatches)
  } catch (error) {
    console.error("Job matching error:", error)

    if ((error as Error).name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Not authorized, token failed" }, { status: 401 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
