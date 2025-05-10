"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, Briefcase, MessageSquare, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ProfileCreation } from "@/components/profile-creation"
import { MatchmakingScreen } from "@/components/matchmaking-screen"
import { ChatScreen } from "@/components/chat-screen"
import { GeminiChatScreen } from "@/components/gemini-chat-screen"
import { AgreementScreen } from "@/components/agreement-screen"
import { AIMatchmakingExplainer } from "@/components/ai-matchmaking-explainer"
import { TranslationIndicator } from "@/components/translation-indicator"
import { MatchListings } from "@/components/match-listings"

export default function LangternApp() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [useAI, setUseAI] = useState(true)

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onContinue={() => setCurrentScreen("profile")} />
      case "profile":
        return <ProfileCreation onComplete={() => setCurrentScreen("matchmaking")} />
      case "matchmaking":
        return (
          <>
            <AIMatchmakingExplainer />
            <MatchmakingScreen onSelectMatch={() => setCurrentScreen("chat")} />
          </>
        )
      case "chat":
        return useAI ? (
          <GeminiChatScreen onProceed={() => setCurrentScreen("agreement")} />
        ) : (
          <ChatScreen onProceed={() => setCurrentScreen("agreement")} />
        )
      case "agreement":
        return <AgreementScreen onComplete={() => setCurrentScreen("dashboard")} />
      case "dashboard":
        return <MatchListings />
      default:
        return <WelcomeScreen onContinue={() => setCurrentScreen("profile")} />
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
          <div className="p-4">{renderScreen()}</div>
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
              description="Chat with Gemini AI translation to bridge language gaps"
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
