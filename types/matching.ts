export interface UserProfile {
  id: string
  name: string
  type: string // "student" or "business"
  location: string
  bio?: string
  languages: Array<{
    language: string
    proficiency: number // 0-100
    wantToLearn: boolean
  }>
  skills: string[]
  field: string
  availability: string // "Full-time", "Part-time", etc.
  duration: string // "3 months", "6 months", etc.
  workArrangement: string // "Remote", "On-site", "Hybrid"
  compensation?: string // "Paid", "Unpaid", "Stipend"
}

export interface MatchResult {
  profileId: string
  name: string
  role: string
  location: string
  languages: string[]
  duration: string
  workArrangement: string
  compensation?: string
  matchPercentage: number
  matchReasons?: string[]
  bio?: string
  field?: string
  skills?: string[]
}
