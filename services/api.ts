// Base API URL - always use the remote API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://langtern.vercel.app"

// Helper function to get the auth token
const getToken = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        return userData.token
      } catch (error) {
        console.error("Failed to parse user data:", error)
        return null
      }
    }
  }
  return null
}

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API request failed with status ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () => apiRequest("/api/auth/me"),
}

// Profile API
export const profileApi = {
  getFullProfile: () => apiRequest("/api/profile"),

  updateProfile: (profileData: any) =>
    apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  addLanguage: (languageId: string, proficiencyLevel: string) =>
    apiRequest("/api/profile/languages", {
      method: "POST",
      body: JSON.stringify({ language_id: languageId, proficiency_level: proficiencyLevel }),
    }),

  removeLanguage: (languageId: string) =>
    apiRequest(`/api/profile/languages?language_id=${languageId}`, {
      method: "DELETE",
    }),

  addSkill: (skillId: string, proficiencyLevel?: string) =>
    apiRequest("/api/profile/skills", {
      method: "POST",
      body: JSON.stringify({
        skill_id: skillId,
        ...(proficiencyLevel ? { proficiency_level: proficiencyLevel } : {}),
      }),
    }),

  removeSkill: (skillId: string) =>
    apiRequest(`/api/profile/skills?skill_id=${skillId}`, {
      method: "DELETE",
    }),
}

// Jobs API
export const jobsApi = {
  getJobs: (params: { query?: string; skills?: string[]; languages?: string[] } = {}) => {
    const queryParams = new URLSearchParams()

    if (params.query) queryParams.append("query", params.query)
    if (params.skills?.length) queryParams.append("skills", params.skills.join(","))
    if (params.languages?.length) queryParams.append("languages", params.languages.join(","))

    return apiRequest(`/api/jobs?${queryParams.toString()}`)
  },

  getMatches: () => apiRequest("/api/match"),

  getApplications: () => apiRequest("/api/applications"),

  applyForJob: (jobId: string, coverLetter?: string) =>
    apiRequest("/api/applications", {
      method: "POST",
      body: JSON.stringify({ job_id: jobId, cover_letter: coverLetter }),
    }),
}

// Messaging API
export const messagingApi = {
  getConversations: () => apiRequest("/api/conversations"),

  createConversation: (participants: string[]) =>
    apiRequest("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ participants }),
    }),

  getMessages: (conversationId: string) => apiRequest(`/api/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, content: string) =>
    apiRequest(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
}

// Reference Data API
export const referenceApi = {
  getLanguages: () => apiRequest("/api/languages"),
  getSkills: () => apiRequest("/api/skills"),
}

// AI Services API
export const aiApi = {
  translate: (text: string, targetLang: string) =>
    apiRequest("/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        targetLang,
      }),
    }),

  searchJobs: (searchValue: string, skills?: string[], languages?: string[]) =>
    apiRequest("/searchJob", {
      method: "POST",
      body: JSON.stringify({
        searchValue,
        skills: skills || [],
        languages: languages || [],
      }),
    }),

  testConnection: () => apiRequest("/test"),
}

export default {
  auth: authApi,
  profile: profileApi,
  jobs: jobsApi,
  messaging: messagingApi,
  reference: referenceApi,
  ai: aiApi,
}
