"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Briefcase, Globe } from "lucide-react"
import api from "@/services/api"

export function JobSearch() {
  const [query, setQuery] = useState("")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [languages, setLanguages] = useState([])
  const [skills, setSkills] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [languagesData, skillsData] = await Promise.all([api.reference.getLanguages(), api.reference.getSkills()])
        setLanguages(languagesData)
        setSkills(skillsData)
      } catch (error) {
        console.error("Failed to fetch reference data:", error)
      }
    }

    fetchReferenceData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const jobsData = await api.jobs.getJobs({
        query,
        languages: selectedLanguages,
        skills: selectedSkills,
      })
      setJobs(jobsData)
    } catch (error) {
      console.error("Failed to search jobs:", error)
      setError("Failed to search jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = (languageId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId],
    )
  }

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) => (prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Filter by Language</h3>
          <div className="flex flex-wrap gap-2">
            {languages.slice(0, 8).map((language: any) => (
              <Badge
                key={language.id}
                variant={selectedLanguages.includes(language.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleLanguage(language.id)}
              >
                {language.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Filter by Skill</h3>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill: any) => (
              <Badge
                key={skill.id}
                variant={selectedSkills.includes(skill.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSkill(skill.id)}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-4">
        {jobs.length === 0 && !loading ? (
          <p className="text-center text-muted-foreground py-8">No jobs found. Try adjusting your search criteria.</p>
        ) : (
          jobs.map((job: any) => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location || "Remote"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.languages?.map((lang: any) => (
                    <Badge key={lang.id} variant="secondary" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {lang.name}
                    </Badge>
                  ))}
                  {job.skills?.map((skill: any) => (
                    <Badge key={skill.id} variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="ml-auto">
                  Apply
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
