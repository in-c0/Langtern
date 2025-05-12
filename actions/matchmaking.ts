"use server"

import { jobsApi } from "@/services/api"
import type { Match, Profile } from "@/types/matching"

export async function findMatches(profile: Profile): Promise<Match[]> {
  try {
    // Use the API service to get job matches
    const matches = await jobsApi.getMatches()
    return matches
  } catch (error) {
    console.error("Error in matchmaking:", error)
    // Return empty array on error
    return []
  }
}
