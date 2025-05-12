export interface LanguageSkill {
  language: string
  proficiency: number // 0-100
  wantToLearn: boolean
}

export interface UserProfile {
  id: string
  name: string
  type: "student" | "business"
  location: string
  bio: string
  languages: LanguageSkill[]
  skills: string[]
  field: string
  availability: string
  duration: string
  workArrangement: string
  compensation: string
}

export interface MatchResult {
  profileId: string
  name: string
  role: string
  location: string
  languages: string[]
  skills: string[]
  duration: string
  workArrangement: string
  matchPercentage: number
  matchReasons: string[]
}

export type Match = MatchResult
export type Profile = UserProfile
