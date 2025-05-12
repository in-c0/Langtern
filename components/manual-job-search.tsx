"use client"

import { useState } from "react"
import { Search, MapPin, Languages, Code, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { searchJobs } from "@/lib/api-service"
import type { MatchResult } from "@/types/matching"
import type { JobResult } from "@/lib/api-service"

// Common languages for selection
const commonLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Portuguese",
  "Italian",
]

// Common skills for selection
const commonSkills = [
  "Web Development",
  "UI/UX Design",
  "Marketing",
  "Content Creation",
  "Social Media",
  "Data Analysis",
  "Teaching",
  "Translation",
  "Business Development",
  "Customer Service",
  "Graphic Design",
  "Video Editing",
  "Digital Marketing",
  "SEO",
  "Brand Strategy",
]

// Common cities for selection
const commonCities = [
  "New York",
  "London",
  "Tokyo",
  "Berlin",
  "Paris",
  "Madrid",
  "Seoul",
  "Sydney",
  "Toronto",
  "Singapore",
  "Remote",
]

export function ManualJobSearch({ onSelectJob }) {
  const [location, setLocation] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customLanguage, setCustomLanguage] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  const [searchResults, setSearchResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddLanguage = (language: string) => {
    if (language && !selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language])
    }
    setCustomLanguage("")
  }

  const handleAddSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setCustomSkill("")
  }

  const handleRemoveLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
  }

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill))
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use either selected location or custom location
      const searchValue = location || customLocation

      if (!searchValue) {
        setError("Please select or enter a location")
        setLoading(false)
        return
      }

      if (selectedLanguages.length === 0) {
        setError("Please select at least one language")
        setLoading(false)
        return
      }

      if (selectedSkills.length === 0) {
        setError("Please select at least one skill")
        setLoading(false)
        return
      }

      // Call the API to search for jobs
      const results = await searchJobs({
        searchValue,
        languages: selectedLanguages,
        skills: selectedSkills,
      })

      console.log("Search results:", results)

      // Transform API results to match our MatchResult type
      const formattedResults: MatchResult[] = results.map((job: JobResult) => {
        // Use the matching_score from the API if available
        let matchPercentage = job.matching_score !== undefined ? Math.round(job.matching_score * 100) : 0

        // If matching_score is not available, calculate it based on skills and languages
        if (matchPercentage === 0) {
          const skillsMatch = job.skills.filter((skill) =>
            selectedSkills.some((s) => skill.toLowerCase().includes(s.toLowerCase())),
          ).length

          const languagesMatch = job.languages.filter((lang) =>
            selectedLanguages.some((l) => lang.toLowerCase().includes(l.toLowerCase())),
          ).length

          const totalSkills = Math.max(job.skills.length, selectedSkills.length)
          const totalLanguages = Math.max(job.languages.length, selectedLanguages.length)

          matchPercentage = Math.floor((skillsMatch / totalSkills) * 50 + (languagesMatch / totalLanguages) * 50)
        }

        // Ensure matchPercentage is between 0 and 100
        matchPercentage = Math.max(0, Math.min(100, matchPercentage))

        // Generate match reasons
        const matchReasons = []
        if (job.matching_score !== undefined) {
          matchReasons.push(`Matching score: ${(job.matching_score * 100).toFixed(1)}%`)
        }

        const skillsMatch = job.skills.filter((skill) =>
          selectedSkills.some((s) => skill.toLowerCase().includes(s.toLowerCase())),
        ).length

        const languagesMatch = job.languages.filter((lang) =>
          selectedLanguages.some((l) => lang.toLowerCase().includes(l.toLowerCase())),
        ).length

        if (skillsMatch > 0) {
          matchReasons.push(`Matches ${skillsMatch} of your skills`)
        }
        if (languagesMatch > 0) {
          matchReasons.push(`Matches ${languagesMatch} of your languages`)
        }
        matchReasons.push(`Located in ${job.city}`)

        return {
          profileId: String(job.id),
          // Handle the typo in the API response (nane instead of name)
          name: job.name || job.nane || job.companyName || "Unknown Company",
          role: job.position || job.field || "Internship",
          location: job.location || `${job.city}, ${job.country}`,
          languages: job.languages || [],
          skills: job.skills || [],
          duration: job.availability || "3 months",
          workArrangement: job.workArrangement || "Remote",
          matchPercentage: job.matchPercentage || matchPercentage,
          matchReasons: job.matchReasons || matchReasons,
          bio: job.bio || "",
          matching_score: job.matching_score, // Store the raw matching score
        }
      })

      setSearchResults(formattedResults)
    } catch (err) {
      console.error("Error searching jobs:", err)
      setError("Failed to search jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Search Jobs</h2>
        <p className="text-sm text-muted-foreground">Find opportunities by specifying your preferences</p>

        {/* Location Selection */}
        <div className="space-y-2">
          <Label>Location</Label>
          <div className="flex gap-2">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {commonCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Or enter custom location..."
                className="pl-9"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Languages Selection */}
        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex gap-2">
            <Select onValueChange={handleAddLanguage}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add a language" />
              </SelectTrigger>
              <SelectContent>
                {commonLanguages
                  .filter((lang) => !selectedLanguages.includes(lang))
                  .map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Or enter custom language..."
                className="pl-9"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customLanguage) {
                    e.preventDefault()
                    handleAddLanguage(customLanguage)
                  }
                }}
              />
            </div>
            <Button variant="outline" onClick={() => handleAddLanguage(customLanguage)} disabled={!customLanguage}>
              Add
            </Button>
          </div>

          {/* Selected Languages */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedLanguages.map((lang) => (
              <Badge key={lang} variant="secondary" className="px-3 py-1">
                {lang}
                <button
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveLanguage(lang)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Select onValueChange={handleAddSkill}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add a skill" />
              </SelectTrigger>
              <SelectContent>
                {commonSkills
                  .filter((skill) => !selectedSkills.includes(skill))
                  .map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Or enter custom skill..."
                className="pl-9"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customSkill) {
                    e.preventDefault()
                    handleAddSkill(customSkill)
                  }
                }}
              />
            </div>
            <Button variant="outline" onClick={() => handleAddSkill(customSkill)} disabled={!customSkill}>
              Add
            </Button>
          </div>

          {/* Selected Skills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1">
                {skill}
                <button
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <Button className="w-full" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search Jobs"}
        </Button>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Search Results</h3>

        {loading ? (
          // Loading skeletons
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="p-4 border border-border/40">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="flex flex-wrap gap-2 mb-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-28" />
                </div>
              </Card>
            ))
        ) : searchResults.length > 0 ? (
          searchResults.map((job) => <JobCard key={job.profileId} job={job} onSelect={() => onSelectJob(job)} />)
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No jobs found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job, onSelect }) {
  return (
    <Card
      className="p-4 border border-border/40 hover:border-blue-500/30 cursor-pointer transition-all"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{job.name}</h3>
          <p className="text-sm text-muted-foreground">{job.role}</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
          {job.matchPercentage}% Match
        </Badge>
      </div>

      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <MapPin className="h-3 w-3 mr-1" /> {job.location}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {job.languages.map((lang) => (
          <Badge key={lang} variant="secondary" className="text-xs">
            <Languages className="h-3 w-3 mr-1" /> {lang}
          </Badge>
        ))}
        {job.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            <Code className="h-3 w-3 mr-1" /> {skill}
          </Badge>
        ))}
        <Badge variant="secondary" className="text-xs">
          <Briefcase className="h-3 w-3 mr-1" /> {job.workArrangement}
        </Badge>
      </div>

      {job.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.bio}</p>}

      {/* Display matching score if available */}
      {job.matching_score !== undefined && (
        <div className="text-xs text-muted-foreground mb-3">
          <span className="font-medium">Matching Score:</span> {(job.matching_score * 100).toFixed(1)}%
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
          View Details
        </Button>
      </div>
    </Card>
  )
}
