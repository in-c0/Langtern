"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { SwipeableMatchCard } from "@/components/swipeable-match-card"
import { findMatches } from "@/actions/matchmaking"
import { findMatchesFallback } from "@/actions/fallback-matching"
import type { UserProfile, MatchResult } from "@/types/matching"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, ThumbsUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface AIMatchmakingProps {
  onSendMessage: (match: MatchResult) => void
  userProfile?: UserProfile
}

export function AIMatchmaking({ onSendMessage, userProfile = sampleUserProfile }: AIMatchmakingProps) {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedMatches, setLikedMatches] = useState<MatchResult[]>([])
  const [passedMatches, setPassedMatches] = useState<MatchResult[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to use the AI-powered matching first
      try {
        const matchResults = await findMatches(userProfile)
        setMatches(matchResults)
      } catch (aiError) {
        console.error("AI matching failed, using fallback:", aiError)
        // If AI matching fails, use the fallback implementation
        const fallbackResults = await findMatchesFallback(userProfile)
        setMatches(fallbackResults)
      }

      setCurrentIndex(0)
    } catch (err) {
      console.error("Error loading matches:", err)
      setError("Failed to load matches. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSwipeLeft = (match: MatchResult) => {
    setPassedMatches([...passedMatches, match])
    toast({
      title: "Passed",
      description: `You passed on ${match.name}`,
    })
  }

  const handleSwipeRight = (match: MatchResult) => {
    setLikedMatches([...likedMatches, match])
    toast({
      title: "Match!",
      description: `You matched with ${match.name}`,
    })
    onSendMessage(match)
  }

  const currentMatch = matches[currentIndex]
  const hasMoreMatches = currentIndex < matches.length - 1

  const handleNext = () => {
    if (hasMoreMatches) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">AI-Powered Matchmaking</h2>
        <p className="text-muted-foreground">Swipe left to pass, right to message</p>
      </div>

      <div className="relative w-full max-w-md h-auto min-h-[32rem]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Finding your perfect matches...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadMatches}>Try Again</Button>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground mb-4">No matches found</p>
            <Button onClick={loadMatches}>Refresh</Button>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {currentMatch && (
                <SwipeableMatchCard
                  key={currentMatch.profileId}
                  match={currentMatch}
                  onSwipeLeft={() => {
                    handleSwipeLeft(currentMatch)
                    handleNext()
                  }}
                  onSwipeRight={() => {
                    handleSwipeRight(currentMatch)
                    handleNext()
                  }}
                  onSendMessage={onSendMessage}
                />
              )}
            </AnimatePresence>

            {!hasMoreMatches && currentIndex >= matches.length - 1 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                <p className="text-xl font-semibold mb-4">You've seen all matches!</p>
                <Button onClick={loadMatches} className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" /> Find More Matches
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {!loading && !error && matches.length > 0 && (
        <div className="mt-8 flex gap-4">
          <Button variant="outline" size="sm" disabled={likedMatches.length === 0}>
            <ThumbsUp className="mr-2 h-4 w-4" /> {likedMatches.length} Liked
          </Button>
          <Button variant="outline" size="sm" disabled={passedMatches.length === 0}>
            {passedMatches.length} Passed
          </Button>
        </div>
      )}
    </div>
  )
}
