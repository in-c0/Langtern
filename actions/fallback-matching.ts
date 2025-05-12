"use server"

import { jobsApi } from "@/services/api"
import type { UserProfile, MatchResult } from "@/types/matching"

// Export with the original name that's being referenced elsewhere
export async function findMatchesFallback(userProfile: UserProfile): Promise<MatchResult[]> {
  try {
    // Use the API service to get job matches with a simple query
    const query = userProfile.languages.map((l) => l.language).join(" ") + " " + userProfile.skills.join(" ")

    const matches = await jobsApi.getJobs({ query })

    // Transform the job results into MatchResult format
    return matches.map((job) => ({
      profileId: job.id,
      name: job.title || job.company_name || "Job Opportunity",
      role: job.title || "Position",
      location: job.city ? `${job.city}, ${job.country}` : job.country || "Remote",
      languages: job.languages?.map((l) => l.name) || [],
      skills: job.skills?.map((s) => s.name) || [],
      duration: job.duration || "Not specified",
      workArrangement: job.remote ? "Remote" : "On-site",
      matchPercentage: 75, // Default match percentage for fallback
      matchReasons: [
        "Matched based on your languages and skills",
        "Similar work arrangement preferences",
        "Opportunity aligns with your profile",
      ],
    }))
  } catch (error) {
    console.error("Error in fallback matchmaking:", error)

    // Return empty array on error
    return []
  }
}
