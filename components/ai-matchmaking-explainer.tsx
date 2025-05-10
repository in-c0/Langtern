"use client"

import { motion } from "framer-motion"
import { Sparkles, Languages, Briefcase, Clock, MapPin, CheckCircle } from "lucide-react"

export function AIMatchmakingExplainer() {
  return (
    <div className="p-4 border border-border/40 rounded-lg bg-card/50 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">AI-Powered Matchmaking</h3>
          <p className="text-sm text-muted-foreground">How we find your perfect match</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MatchFactorCard
          icon={<Languages className="h-4 w-4" />}
          title="Language Compatibility"
          description="Matches based on shared languages and learning goals"
        />

        <MatchFactorCard
          icon={<Briefcase className="h-4 w-4" />}
          title="Skills Alignment"
          description="Analyzes how your skills match position requirements"
        />

        <MatchFactorCard
          icon={<Clock className="h-4 w-4" />}
          title="Availability & Duration"
          description="Ensures schedule compatibility for both parties"
        />

        <MatchFactorCard
          icon={<MapPin className="h-4 w-4" />}
          title="Location & Timezone"
          description="Considers geographic and time zone compatibility"
        />
      </div>
    </div>
  )
}

function MatchFactorCard({ icon, title, description }) {
  return (
    <motion.div
      className="flex items-start gap-3 p-3 rounded-lg border border-border/40"
      whileHover={{ y: -3, borderColor: "rgba(59, 130, 246, 0.5)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="mt-0.5 text-blue-500">{icon}</div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-0.5" />
    </motion.div>
  )
}
