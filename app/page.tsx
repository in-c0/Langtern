"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Globe, Briefcase, MessageSquare, CheckCircle, LogIn, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ProfileCreation } from "@/components/profile-creation"
import { BusinessProfileCreation } from "@/components/business-profile-creation"
import { MatchmakingScreen } from "@/components/matchmaking-screen"
import { ChatScreen } from "@/components/chat-screen"
import { AgreementScreen } from "@/components/agreement-screen"
import { AIMatchmakingExplainer } from "@/components/ai-matchmaking-explainer"
import { TranslationIndicator } from "@/components/translation-indicator"
import { MatchListings } from "@/components/match-listings"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

// Guest user profile data - no longer needed as we'll use real login
const guestUserProfile = {
  fullName: "Guest User",
  email: "guest@langtern.com",
  location: "us",
  bio: "I'm exploring Langtern as a guest user.",
  nativeLanguage: "en",
  targetLanguage: "es",
  field: "tech",
  educationLevel: "bachelors",
  skills: "Web Development, UI/UX Design, Content Writing",
  experienceLevel: "entry",
  availability: "part-time",
  duration: "3-months",
  workArrangement: "remote",
  compensation: "negotiable",
}

export default function LangternApp() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [userType, setUserType] = useState<"student" | "business" | null>(null)
  const [userProfile, setUserProfile] = useState(null)
  const { user, isLoading, signIn } = useAuth()
  const router = useRouter()
  const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)

  // Check if user is logged in and has completed their profile
  useEffect(() => {
    if (!isLoading && user) {
      // If user is logged in but we're on the welcome screen,
      // move them to matchmaking directly
      if (currentScreen === "welcome") {
        setUserType(user.userType || "student") // Default to student if not specified
        setCurrentScreen("matchmaking")
      }

      // If we were in the process of guest login and now have a user, go to matchmaking
      if (isGuestLoggingIn) {
        setIsGuestLoggingIn(false)
        setCurrentScreen("matchmaking")
      }
    }
  }, [isLoading, user, currentScreen, isGuestLoggingIn])

  const handleUserTypeSelection = (type: "student" | "business") => {
    if (user) {
      // If user is already logged in, just set type and go to matchmaking
      setUserType(type)
      setCurrentScreen("matchmaking")
    } else {
      // If not logged in, go to profile creation
      setUserType(type)
      setCurrentScreen("profile")
    }
  }

  const handleGuestContinue = async () => {
    // Use the specified guest credentials
    setIsGuestLoggingIn(true)
    try {
      await signIn({
        email: "a2@a.com",
        password: "123",
      })
      // The useEffect will handle navigation once login is complete
    } catch (error) {
      console.error("Guest login failed:", error)
      setIsGuestLoggingIn(false)
      // Fallback to the old method if login fails
      setUserType("student")
      setUserProfile(guestUserProfile)
      setCurrentScreen("matchmaking")
    }
  }

  const handleProfileComplete = (profileData) => {
    setUserProfile(profileData)
    setCurrentScreen("matchmaking")
  }

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleGoToProfile = () => {
    router.push("/profile")
  }

  const handleFindMatches = () => {
    setCurrentScreen("matchmaking")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onContinue={handleUserTypeSelection} onGuestContinue={handleGuestContinue} />
      case "profile":
        return userType === "business" ? (
          <BusinessProfileCreation onComplete={handleProfileComplete} onBack={handleBackToWelcome} />
        ) : (
          <ProfileCreation onComplete={handleProfileComplete} onBack={handleBackToWelcome} />
        )
      case "matchmaking":
        return (
          <>
            <AIMatchmakingExplainer />
            <MatchmakingScreen
              onSelectMatch={(match) => {
                setSelectedMatch(match)
                setCurrentScreen("chat")
              }}
            />
          </>
        )
      case "chat":
        return <ChatScreen match={selectedMatch} onProceed={() => setCurrentScreen("agreement")} />
      case "agreement":
        return <AgreementScreen onComplete={() => setCurrentScreen("dashboard")} />
      case "dashboard":
        return <MatchListings />
      default:
        return <WelcomeScreen onContinue={handleUserTypeSelection} onGuestContinue={handleGuestContinue} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-start p-4 pt-8">
      {/* App Navigation */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Langtern
            </h1>
          </div>
          <div className="flex gap-2">
            {currentScreen !== "welcome" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentScreen("welcome")}
                className="text-muted-foreground"
              >
                Home
              </Button>
            )}

            {/* Show Find Matches button for logged in users */}
            {user && currentScreen !== "matchmaking" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFindMatches}
                className="text-green-500 border-green-500"
              >
                <Search className="h-4 w-4 mr-1" />
                Find Matches
              </Button>
            )}

            {user ? (
              <Button variant="outline" size="sm" onClick={handleGoToProfile} className="text-blue-500 border-blue-500">
                My Profile
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogin} className="text-blue-500 border-blue-500">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentScreen !== "welcome" && (
        <div className="w-full max-w-md mb-6">
          <div className="flex justify-between items-center px-2">
            <div className="w-full flex justify-between">
              <ProgressStep
                icon={<Briefcase className="h-4 w-4" />}
                label="Profile"
                active={currentScreen === "profile"}
                completed={["matchmaking", "chat", "agreement", "dashboard"].includes(currentScreen)}
              />
              <ProgressStep
                icon={<Globe className="h-4 w-4" />}
                label="Match"
                active={currentScreen === "matchmaking"}
                completed={["chat", "agreement", "dashboard"].includes(currentScreen)}
              />
              <ProgressStep
                icon={<MessageSquare className="h-4 w-4" />}
                label="Chat"
                active={currentScreen === "chat"}
                completed={["agreement", "dashboard"].includes(currentScreen)}
              />
              <ProgressStep
                icon={<CheckCircle className="h-4 w-4" />}
                label="Agree"
                active={currentScreen === "agreement"}
                completed={["dashboard"].includes(currentScreen)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-md">
        <Card className="border border-border/40 shadow-lg overflow-hidden">
          <div className="p-4">
            {isGuestLoggingIn ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-muted-foreground">Logging in as guest...</p>
              </div>
            ) : (
              renderScreen()
            )}
          </div>
        </Card>
      </div>

      {/* Translation Indicator */}
      {currentScreen === "chat" && <TranslationIndicator active={true} />}

      {/* App Features */}
      {currentScreen === "welcome" && (
        <div className="w-full max-w-md mt-8">
          <h2 className="text-lg font-semibold mb-4 text-center">Key Features</h2>
          <div className="grid grid-cols-1 gap-4">
            <FeatureCard
              icon={<Globe className="h-5 w-5 text-blue-500" />}
              title="AI-Powered Matchmaking"
              description="Smart matching based on language, skills, and interests"
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
              title="Real-time Translation"
              description="Chat with AI translation to bridge language gaps"
            />
            <FeatureCard
              icon={<Briefcase className="h-5 w-5 text-green-500" />}
              title="Structured Internships"
              description="Templates and guidance for successful collaborations"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressStep({ icon, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full p-2 ${
          active ? "bg-blue-500 text-white" : completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <span className={`text-xs mt-1 ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      className="p-4 rounded-xl border border-border/40 bg-card hover:bg-card/80"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
