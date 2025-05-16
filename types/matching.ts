export interface LanguageProficiency {
  reading: string
  writing: string
  speaking: string
}

export interface LanguageSkill {
  code: string
  name: string
  isLearning: boolean
  proficiency: LanguageProficiency
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
