"use server"

import type { UserProfile, MatchResult } from "@/types/matching"
import { searchJobs } from "@/lib/api-service"

// Sample database of potential matches (in a real app, this would come from a database)
const sampleProfiles = [
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

// Predefined match results to use as fallback
const fallbackMatches: MatchResult[] = [
  {
    profileId: "1",
    name: "Tokyo Tech Solutions",
    role: "Marketing Intern",
    location: "Tokyo, Japan",
    languages: ["Japanese", "English"],
    skills: ["Marketing", "Social Media", "Content Creation"],
    duration: "3 months",
    workArrangement: "Remote",
    matchPercentage: 92,
    matchReasons: [
      "Strong alignment between your marketing skills and their needs",
      "Perfect match for language learning - you want to learn Japanese and they want to improve English",
      "Remote work arrangement matches your preference",
    ],
    reason: [
      "You have Marketing skills which match this job requirement",
      "Your English proficiency is perfect for this position",
    ],
  },
  {
    profileId: "3",
    name: "Madrid Language School",
    role: "Teaching Assistant & Social Media Coordinator",
    location: "Madrid, Spain",
    languages: ["Spanish", "English"],
    skills: ["Teaching", "Curriculum Development", "Event Planning"],
    duration: "3 months",
    workArrangement: "On-site",
    matchPercentage: 84,
    matchReasons: [
      "Your Spanish proficiency is a great fit for their language school",
      "Your content creation skills can help with their curriculum development",
      "Part-time availability matches their needs",
    ],
    reason: [
      "You have Teaching skills which match this job requirement",
      "Your English proficiency is perfect for this position",
    ],
  },
  {
    profileId: "4",
    name: "Paris Marketing Group",
    role: "Digital Marketing Intern",
    location: "Paris, France",
    languages: ["French", "English"],
    skills: ["Social Media", "Content Creation", "Brand Strategy"],
    duration: "3 months",
    workArrangement: "Hybrid",
    matchPercentage: 76,
    matchReasons: [
      "Your digital marketing experience aligns with their luxury brand focus",
      "Opportunity to apply your social media skills in a new market",
      "Flexible work arrangement with both remote and on-site options",
    ],
    reason: [
      "You have Social Media skills which match this job requirement",
      "Your English proficiency is perfect for this position",
    ],
  },
  {
    profileId: "2",
    name: "Berlin Digital Agency",
    role: "Content Marketing Intern",
    location: "Berlin, Germany",
    languages: ["German", "English"],
    skills: ["Web Development", "UI/UX Design", "JavaScript"],
    duration: "6 months",
    workArrangement: "Hybrid",
    matchPercentage: 68,
    matchReasons: [
      "Your content creation skills can complement their technical focus",
      "Opportunity to learn about web development while applying marketing skills",
      "International experience in a major European tech hub",
    ],
    reason: [
      "You have Web Development skills which match this job requirement",
      "Your English proficiency is perfect for this position",
    ],
  },
  {
    profileId: "5",
    name: "Seoul Tech Startup",
    role: "Marketing Research Assistant",
    location: "Seoul, South Korea",
    languages: ["Korean", "English"],
    skills: ["Business Development", "Market Research", "Data Analysis"],
    duration: "6 months",
    workArrangement: "Remote",
    matchPercentage: 65,
    matchReasons: [
      "Remote work arrangement matches your preference",
      "Opportunity to apply marketing skills in market research",
      "Chance to learn about the Korean tech market",
    ],
    reason: [
      "You have Business Development skills which match this job requirement",
      "Your English proficiency is perfect for this position",
    ],
  },
]

export async function findMatchesFallback(userProfile: UserProfile): Promise<MatchResult[]> {
  try {
    // Extract user's location (city or country)
    const locationParts = userProfile.location.split(",").map((part) => part.trim())
    const searchValue = locationParts[0] // Use the first part (city) as search value

    // Extract user's skills
    const skills = userProfile.skills || []

    // Extract user's languages
    const languages = userProfile.languages.map((lang) => lang.language)

    // Call the backend API to search for jobs
    const searchResults = await searchJobs({
      searchValue,
      skills,
      languages,
    })

    // If the API returns results, transform them to match our MatchResult type
    if (searchResults && Array.isArray(searchResults)) {
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
          reason: result.reason || ["Skills match your profile", "Language requirements align with your abilities"],
        }
      })
    }

    // Fallback to predefined matches if API fails
    console.log("Using predefined fallback matches")
    return fallbackMatches
  } catch (error) {
    console.error("Error in fallback matching:", error)
    // Return the predefined fallback matches in case of error
    return fallbackMatches
  }
}
