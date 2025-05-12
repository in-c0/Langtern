import { NextResponse } from "next/server"
import { supabase } from "@/config/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get("query") || ""
    const skills = url.searchParams.get("skills")?.split(",") || []
    const languages = url.searchParams.get("languages")?.split(",") || []

    let query = supabase.from("jobs").select(`
        *,
        companies(*),
        job_languages(*, languages(*)),
        job_skills(*, skills(*))
      `)

    // Apply filters if provided
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,country.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`,
      )
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching jobs:", error)
      return NextResponse.json({ message: "Failed to fetch jobs" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
