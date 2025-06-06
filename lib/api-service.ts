const API_BASE_URL = "https://bigbackend-2.vercel.app"

export interface SearchJobParams {
  searchValue: string // country or city
  skills: string[]
  languages: string[]
}

export interface TranslationParams {
  text: string
  targetLang: string
}

export interface TranslationResponse {
  translatedText: string
  detectedLanguage?: string
}

export interface JobResult {
  id: number
  nane?: string // Handle the typo in the API response
  name?: string
  city: string
  country: string
  languages: string[]
  skills: string[]
  field: string
  availability: string
  workArrangement: string
  created_at: string
  bio: string
  companyName?: string
  position?: string
  location?: string
  role?: string
  matchPercentage?: number
  matchReasons?: string[]
  matching_score?: number
  reason?: string[] // Add the new reason field
}

export async function searchJobs(params: SearchJobParams): Promise<JobResult[]> {
  try {
    console.log("Calling searchJobs API with:", params)

    const response = await fetch(`${API_BASE_URL}/searchJob`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    })

    // Log the raw response for debugging
    console.log("Search API response status:", response.status)

    if (!response.ok) {
      console.error("Search API error:", response.status)
      const errorText = await response.text()
      console.error("Error response text:", errorText)
      throw new Error(`API error: ${response.status}`)
    }

    // Get the raw text response first
    const rawText = await response.text()
    console.log("Raw API response text:", rawText)

    // If the response is empty, return an empty array
    if (!rawText || rawText.trim() === "") {
      console.log("Empty response received from API")
      return []
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(rawText)
      console.log("Parsed API response:", data)

      // Handle different response formats
      if (data && typeof data.response === "string") {
        try {
          // Parse the nested JSON string
          const parsedJobs = JSON.parse(data.response.trim())
          console.log("Parsed jobs from nested response:", parsedJobs)

          // Return the parsed jobs array
          return Array.isArray(parsedJobs) ? parsedJobs : []
        } catch (parseError) {
          console.error("Error parsing job results:", parseError)
          // Try to handle non-JSON response
          if (typeof data.response === "string" && data.response.includes("No jobs found")) {
            console.log("No jobs found message received")
            return []
          }
          return []
        }
      } else if (Array.isArray(data)) {
        // Direct array response
        return data
      } else if (data && Array.isArray(data.jobs)) {
        // Response with jobs property
        return data.jobs
      } else if (data && data.results && Array.isArray(data.results)) {
        // Response with results property
        return data.results
      }

      // Fallback if the response format is different
      return Array.isArray(data) ? data : []
    } catch (jsonError) {
      console.error("Error parsing API response as JSON:", jsonError)
      console.log("Non-JSON response received:", rawText)
      // Return empty array instead of throwing an error
      return []
    }
  } catch (error) {
    console.error("Error searching jobs:", error)
    throw error
  }
}

export async function translateText(params: TranslationParams): Promise<TranslationResponse> {
  try {
    console.log("API Service: Calling translate endpoint with:", params)

    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Translation API error:", response.status)
      const errorText = await response.text()
      console.error("Translation error response:", errorText)
      throw new Error(`API error: ${response.status}`)
    }

    // Get the raw text response first
    const rawText = await response.text()
    console.log("Raw translation API response text:", rawText)

    // Try to parse as JSON
    try {
      const result = JSON.parse(rawText)
      console.log("Translation API response:", result)

      // Extract the translated text from the response
      // The API returns { "response": "translated text" }
      const translatedText = result.response ? result.response.trim() : params.text

      return {
        translatedText: translatedText,
        detectedLanguage: result.detectedLanguage,
      }
    } catch (jsonError) {
      console.error("Error parsing translation response as JSON:", jsonError)
      // Return the original text if parsing fails
      return {
        translatedText: params.text,
      }
    }
  } catch (error) {
    console.error("Error translating text:", error)
    // Return the original text if translation fails
    return {
      translatedText: params.text,
    }
  }
}
