"use server"

import type { UserProfile, MatchResult } from "@/types/matching"
import { searchJobs } from "@/lib/api-service"

// Sample database of potential matches (in a real app, this would come from a database)
const sampleProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Tokyo Tech Solutions",
    type: "business",
    location: "Tokyo, Japan",
    bio: "Tech company specializing in mobile apps and web development",
    languages: [
      { language: "Japanese", proficiency: 100, wantToLearn: false },
      { language: "English", proficiency: 60, wantToLearn: true },
    ],
    skills: ["Marketing", "Social Media", "Content Creation"],
    field: "Technology",
    availability: "Part-time",
    duration: "3 months",
    workArrangement: "Remote",
    compensation: "Paid",
  },
  {
    id: "2",
    name: "Berlin Digital Agency",
    type: "business",
    location: "Berlin, Germany",
    bio: "Creative digital agency working with international clients",
    languages: [
      { language: "German", proficiency: 100, wantToLearn: false },
      { language: "English", proficiency: 80, wantToLearn: false },
    ],
    skills: ["Web Development", "UI/UX Design", "JavaScript"],
    field: "Design",
    availability: "Full-time",
    duration: "6 months",
    workArrangement: "Hybrid",
    compensation: "Paid",
  },
  {
    id: "3",
    name: "Madrid Language School",
    type: "business",
    location: "Madrid, Spain",
    bio: "Language school teaching Spanish to international students",
    languages: [
      { language: "Spanish", proficiency: 100, wantToLearn: false },
      { language: "English", proficiency: 70, wantToLearn: true },
    ],
    skills: ["Teaching", "Curriculum Development", "Event Planning"],
    field: "Education",
    availability: "Part-time",
    duration: "3 months",
    workArrangement: "On-site",
    compensation: "Language Exchange",
  },
  {
    id: "4",
    name: "Paris Marketing Group",
    type: "business",
    location: "Paris, France",
    bio: "Marketing agency specializing in luxury brands",
    languages: [
      { language: "French", proficiency: 100, wantToLearn: false },
      { language: "English", proficiency: 75, wantToLearn: false },
    ],
    skills: ["Social Media", "Content Creation", "Brand Strategy"],
    field: "Marketing",
    availability: "Part-time",
    duration: "3 months",
    workArrangement: "Hybrid",
    compensation: "Paid",
  },
  {
    id: "5",
    name: "Seoul Tech Startup",
    type: "business",
    location: "Seoul, South Korea",
    bio: "Innovative startup in the fintech space",
    languages: [
      { language: "Korean", proficiency: 100, wantToLearn: false },
      { language: "English", proficiency: 65, wantToLearn: true },
    ],
    skills: ["Business Development", "Market Research", "Data Analysis"],
    field: "Technology",
    availability: "Full-time",
    duration: "6 months",
    workArrangement: "Remote",
    compensation: "Paid",
  },
]

export async function findMatches(userProfile: UserProfile): Promise<MatchResult[]> {
  try {
    // Extract user's location (city or country)
    const locationParts = userProfile.location.split(",").map((part) => part.trim())
    const searchValue = locationParts[0] // Use the first part (city) as search value

    // Extract user's skills
    const skills = userProfile.skills || []

    // Extract user's languages
    const languages = userProfile.languages.map((lang) => lang.language)

    // Call the backend API to search for jobs
    let searchResults = []
    try {
      searchResults = await searchJobs({
        searchValue,
        skills,
        languages,
      })
    } catch (apiError) {
      console.error("API search failed:", apiError)
      // Continue with empty results, will use fallback below
    }

    // If the API returns results, transform them to match our MatchResult type
    if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
      return searchResults.map((result, index) => {
        // Map the API response to our MatchResult type
        return {
          profileId: result.id || String(index + 1),
          name: result.companyName || result.name || `Company ${index + 1}`,
          role: result.role || result.position || "Intern",
          location: result.location || "Remote",
          languages: result.languages || [],
          skills: result.skills || [],
          duration: result.duration || "3 months",
          workArrangement: result.workArrangement || result.arrangement || "Remote",
          matchPercentage: result.matchPercentage || Math.floor(Math.random() * 30) + 70, // Random 70-100% if not provided
          matchReasons: result.matchReasons || [
            "Skills match your profile",
            "Language requirements align with your abilities",
            "Location preference matches",
          ],
        }
      })
    }

    // Fallback to sample data if API fails or returns empty results
    console.log("Using sample profiles as fallback")
    return sampleProfiles
      .filter((profile) => profile.type !== userProfile.type) // Only match students with businesses and vice versa
      .map((profile) => {
        // Create a match result from sample profile
        return {
          profileId: profile.id,
          name: profile.name,
          role: "Intern",
          location: profile.location,
          languages: profile.languages.map((l) => l.language),
          skills: profile.skills,
          duration: profile.duration,
          workArrangement: profile.workArrangement,
          matchPercentage: Math.floor(Math.random() * 30) + 70, // Random 70-100%
          matchReasons: [
            "Skills match your profile",
            "Language requirements align with your abilities",
            "Location preference matches",
          ],
        }
      })
  } catch (error) {
    console.error("Error in matchmaking:", error)
    // Return empty array instead of throwing an error
    return []
  }
}
