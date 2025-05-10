"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { UserProfile, MatchResult } from "@/types/matching"
import { formatProfileForAI } from "@/lib/profile-formatter"

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
    const userProfileText = formatProfileForAI(userProfile)

    // Create a list of potential matches to evaluate
    const potentialMatches = sampleProfiles
      .filter((profile) => profile.type !== userProfile.type) // Only match students with businesses and vice versa
      .map((profile) => formatProfileForAI(profile))
      .join("\n\n---\n\n")

    const prompt = `
You are an AI matchmaker for Langtern, a platform that connects students and professionals for internships and language learning opportunities.

Given a user profile and a list of potential matches, evaluate the compatibility between them based on:
1. Language compatibility (shared languages or complementary language learning goals)
2. Skills relevance to the position
3. Field/industry alignment
4. Availability and duration compatibility
5. Work arrangement preferences
6. Location and timezone compatibility

For each potential match, provide:
1. A match percentage (0-100%)
2. A list of 2-3 specific reasons why they are a good match
3. A suggested role title based on the skills and requirements

USER PROFILE:
${userProfileText}

POTENTIAL MATCHES:
${potentialMatches}

Return the results as a JSON array with the following structure for each match:
[
  {
    "profileId": "ID from the potential match",
    "matchPercentage": 85,
    "matchReasons": ["Reason 1", "Reason 2", "Reason 3"],
    "suggestedRole": "Suggested role title"
  }
]

Sort the results by match percentage in descending order. Only include matches with a percentage of 50% or higher.
`

    // Call OpenAI API using AI SDK instead of Gemini
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.2,
      maxTokens: 2000,
    })

    // Parse the response
    const matchesData = JSON.parse(text)

    // Map the AI results to our MatchResult type with additional data from our sample profiles
    const matches: MatchResult[] = matchesData
      .map((match) => {
        const profileData = sampleProfiles.find((p) => p.id === match.profileId)
        if (!profileData) return null

        return {
          profileId: profileData.id,
          name: profileData.name,
          role: match.suggestedRole,
          location: profileData.location,
          languages: profileData.languages.map((l) => l.language),
          skills: profileData.skills,
          duration: profileData.duration,
          workArrangement: profileData.workArrangement,
          matchPercentage: match.matchPercentage,
          matchReasons: match.matchReasons,
        }
      })
      .filter(Boolean)

    return matches
  } catch (error) {
    console.error("Error in matchmaking:", error)
    throw new Error("Failed to generate matches. Please try again later.")
  }
}
