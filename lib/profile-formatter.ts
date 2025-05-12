import type { UserProfile } from "@/types/matching"

export function formatProfileForAI(profile: UserProfile): string {
  const languagesInfo = profile.languages
    .map(
      (lang) =>
        `${lang.language} (${getLanguageProficiencyLabel(lang.proficiency)}${lang.wantToLearn ? ", wants to learn" : ""})`,
    )
    .join(", ")

  return `
User Profile:
- Name: ${profile.name}
- Type: ${profile.type === "student" ? "Student looking for internship" : "Business looking for intern"}
- Location: ${profile.location}
- Bio: ${profile.bio}
- Languages: ${languagesInfo}
- Skills: ${profile.skills.join(", ")}
- Field/Industry: ${profile.field}
- Availability: ${profile.availability}
- Preferred Duration: ${profile.duration}
- Work Arrangement: ${profile.workArrangement}
- Compensation: ${profile.compensation}
`
}

export function getLanguageProficiencyLabel(level: number): string {
  if (level < 20) return "Beginner"
  if (level < 40) return "Elementary"
  if (level < 60) return "Intermediate"
  if (level < 80) return "Advanced"
  return "Native/Fluent"
}
