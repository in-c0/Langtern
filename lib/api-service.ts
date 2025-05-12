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

export async function searchJobs(params: SearchJobParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/searchJob`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching jobs:", error)
    throw error
  }
}

export async function translateText(params: TranslationParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error translating text:", error)
    throw error
  }
}
