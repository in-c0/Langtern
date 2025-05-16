"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, MessageCircle, MapPin, Languages, Briefcase, Clock, Info, Star } from "lucide-react"
import type { MatchResult } from "@/types/matching"
import { MatchProfileDetail } from "@/components/match-profile-detail"

interface SwipeableMatchCardProps {
  match: MatchResult
  onSwipeLeft: (match: MatchResult) => void
  onSwipeRight: (match: MatchResult) => void
  onSendMessage?: (match: MatchResult) => void
}

export function SwipeableMatchCard({ match, onSwipeLeft, onSwipeRight, onSendMessage }: SwipeableMatchCardProps) {
  const [exitX, setExitX] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const leftIndicatorOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0])
  const rightIndicatorOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1])

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setExitX(200)
      onSwipeRight(match)
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onSwipeLeft(match)
    }
  }

  const getRandomImage = (name: string, role: string) => {
    // Generate a consistent but random image based on the name and role
    const seed = name.length + role.length
    const gender = seed % 2 === 0 ? "men" : "women"
    const id = (seed % 30) + 1
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
  }

  return (
    <>
      <motion.div
        className="absolute w-full"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
      >
        <CardContainer className="py-0" containerClassName="py-0">
          <CardBody className="bg-card relative group/card border-border w-full sm:w-[26rem] h-[32rem] rounded-xl p-0 border overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

            {/* Swipe indicators */}
            <motion.div
              className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-red-500/80 text-white p-4 rounded-full z-20"
              style={{ opacity: leftIndicatorOpacity }}
            >
              <X className="h-8 w-8" />
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-green-500/80 text-white p-4 rounded-full z-20"
              style={{ opacity: rightIndicatorOpacity }}
            >
              <MessageCircle className="h-8 w-8" />
            </motion.div>

            {/* Profile image */}
            <CardItem translateZ="0" className="w-full h-full">
              <Image
                src={getRandomImage(match.name, match.role) || "/placeholder.svg"}
                height={800}
                width={600}
                className="h-full w-full object-cover"
                alt={match.name}
              />
            </CardItem>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <CardItem translateZ="50" className="text-2xl font-bold text-white mb-1">
                {match.name}
              </CardItem>

              <CardItem translateZ="40" className="text-lg text-white/90 mb-3">
                {match.role}
              </CardItem>

              <CardItem translateZ="30" className="flex items-center text-sm text-white/80 mb-3">
                <MapPin className="h-4 w-4 mr-1" /> {match.location}
              </CardItem>

              <CardItem translateZ="30" className="flex flex-wrap gap-2 mb-4">
                {match.languages.slice(0, 2).map((lang) => (
                  <Badge key={lang} variant="secondary" className="bg-white/20 text-white border-none">
                    <Languages className="h-3 w-3 mr-1" /> {lang}
                  </Badge>
                ))}
                <Badge variant="secondary" className="bg-white/20 text-white border-none">
                  <Briefcase className="h-3 w-3 mr-1" /> {match.duration}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-none">
                  <Clock className="h-3 w-3 mr-1" /> {match.workArrangement}
                </Badge>
              </CardItem>

              <CardItem translateZ="20" className="mb-4">
                <Badge className="bg-blue-500 text-white border-none">{match.matchPercentage}% Match</Badge>
              </CardItem>

              {/* Match reasons */}
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Why you match:</h4>
                <ul className="text-xs text-muted-foreground">
                  {match.reason ? (
                    // Use the first reason from the new reason array if available
                    <li className="flex items-start mb-1">
                      <Star className="h-3 w-3 mr-1 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{match.reason[0]}</span>
                    </li>
                  ) : match.matchReasons && match.matchReasons.length > 0 ? (
                    // Fall back to the first matchReason if reason is not available
                    <li className="flex items-start mb-1">
                      <Star className="h-3 w-3 mr-1 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{match.matchReasons[0]}</span>
                    </li>
                  ) : (
                    <li>No matching details available</li>
                  )}
                </ul>
              </div>

              <CardItem translateZ="60" className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20"
                  onClick={() => onSwipeLeft(match)}
                >
                  <X className="h-6 w-6 text-white" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20"
                  onClick={() => setShowDetails(true)}
                >
                  <Info className="h-6 w-6 text-white" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20"
                  onClick={() => (onSendMessage ? onSendMessage(match) : onSwipeRight(match))}
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </Button>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </motion.div>

      <MatchProfileDetail
        match={match}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onMessage={onSendMessage || onSwipeRight}
        onPass={onSwipeLeft}
      />
    </>
  )
}
