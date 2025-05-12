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

    if (!response.ok) {
      console.error("Search API error:", response.status, await response.text())
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Raw API response:", data)

    // Handle the nested JSON string in the response field
    if (data && typeof data.response === "string") {
      try {
        // Parse the nested JSON string
        const parsedJobs = JSON.parse(data.response.trim())
        console.log("Parsed jobs:", parsedJobs)

        // Return the parsed jobs array
        return Array.isArray(parsedJobs) ? parsedJobs : []
      } catch (parseError) {
        console.error("Error parsing job results:", parseError)
        return []
      }
    }

    // Fallback if the response format is different
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error searching jobs:", error)
    return []
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
      console.error("Translation API error:", response.status, await response.text())
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Translation API response:", result)

    return {
      translatedText: result.translatedText || params.text,
      detectedLanguage: result.detectedLanguage,
    }
  } catch (error) {
    console.error("Error translating text:", error)
    // Return the original text if translation fails
    return {
      translatedText: params.text,
    }
  }
}
