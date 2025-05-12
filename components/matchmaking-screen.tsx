"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Star, MapPin, Languages, Briefcase, Clock, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { findMatches } from "@/actions/matchmaking"
import { findMatchesFallback } from "@/actions/fallback-matching"
import { ManualJobSearch } from "@/components/manual-job-search"
import type { UserProfile, MatchResult } from "@/types/matching"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample user profile (in a real app, this would come from the user's profile)
const sampleUserProfile: UserProfile = {
  id: "user1",
  name: "John Doe",
  type: "student",
  location: "New York, USA",
  bio: "Marketing student looking for international experience",
  languages: [
    { language: "English", proficiency: 100, wantToLearn: false },
    { language: "Japanese", proficiency: 30, wantToLearn: true },
    { language: "Spanish", proficiency: 60, wantToLearn: false },
  ],
  skills: ["Digital Marketing", "Social Media", "Content Creation"],
  field: "Marketing",
  availability: "Part-time",
  duration: "3 months",
  workArrangement: "Remote",
  compensation: "Paid",
}

export function MatchmakingScreen({ onSelectMatch }) {
  const [showFilters, setShowFilters] = useState(false)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageMatchFilter, setLanguageMatchFilter] = useState(50)
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [paidOnly, setPaidOnly] = useState(false)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to use the AI-powered matching first
        try {
          const matchResults = await findMatches(sampleUserProfile)
          setMatches(matchResults)
        } catch (aiError) {
          console.error("AI matching failed, using fallback:", aiError)
          // If AI matching fails, use the fallback implementation
          const fallbackResults = await findMatchesFallback(sampleUserProfile)
          setMatches(fallbackResults)
        }
      } catch (err) {
        console.error("Error loading matches:", err)
        setError("Failed to load matches. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  // Filter matches based on search query and filters
  const filteredMatches = matches.filter((match) => {
    // Filter by search query
    if (
      searchQuery &&
      !match.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !match.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !match.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by match percentage
    if (match.matchPercentage < languageMatchFilter) {
      return false
    }

    // Filter by remote only
    if (remoteOnly && match.workArrangement !== "Remote") {
      return false
    }

    // Filter by paid only
    if (paidOnly && !match.compensation?.includes("Paid")) {
      return false
    }

    return true
  })

  return (
    <div className="py-2">
      <h2 className="text-xl font-semibold mb-1">Find Your Match</h2>
      <p className="text-sm text-muted-foreground mb-4">AI-powered matchmaking based on your profile</p>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="search">Manual Search</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <motion.div
              className="mb-4 p-3 border border-border/40 rounded-lg bg-card/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-medium mb-3">Filters</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Match Percentage</span>
                    <span className="text-muted-foreground">{languageMatchFilter}%+</span>
                  </div>
                  <Slider
                    defaultValue={[languageMatchFilter]}
                    min={50}
                    max={100}
                    step={5}
                    onValueChange={(value) => setLanguageMatchFilter(value[0])}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                    <Label htmlFor="remote" className="text-sm">
                      Remote Only
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="paid" checked={paidOnly} onCheckedChange={setPaidOnly} />
                    <Label htmlFor="paid" className="text-sm">
                      Paid Only
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground mb-2">
            <Star className="h-4 w-4 inline-block mr-1 text-yellow-500" />
            Top matches based on your profile
          </div>

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
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match) => <MatchCard key={match.profileId} match={match} onSelect={onSelectMatch} />)
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No matches found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search">
          <ManualJobSearch onSelectJob={onSelectMatch} />
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-2">Your saved opportunities</div>

          {/* Empty state */}
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <Star className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No saved opportunities yet</p>
            <p className="text-xs text-muted-foreground mt-1">Save opportunities by clicking the star icon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchCard({ match, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 border border-border/40 hover:border-blue-500/30 cursor-pointer" onClick={() => onSelect()}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{match.name}</h3>
            <p className="text-sm text-muted-foreground">{match.role}</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
            {match.matchPercentage}% Match
          </Badge>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 mr-1" /> {match.location}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {match.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              <Languages className="h-3 w-3 mr-1" /> {lang}
            </Badge>
          ))}
          <Badge variant="secondary" className="text-xs">
            <Briefcase className="h-3 w-3 mr-1" /> {match.duration}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" /> {match.workArrangement}
          </Badge>
        </div>

        <div className="mb-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Why you match:</strong>
          <ul className="list-disc list-inside mt-1">
            {match.matchReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end">
          <Button size="sm" variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
