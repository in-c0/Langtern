"use client"

import { motion } from "framer-motion"
import { Globe, Languages, Briefcase, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeScreen({ onContinue, onGuestContinue }) {
  return (
    <div className="flex flex-col items-center py-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-xl" />
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-4">
            <Globe className="h-12 w-12 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.h1
        className="text-2xl font-bold text-center mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Welcome to Langtern
      </motion.h1>

      <motion.p
        className="text-center text-muted-foreground mb-8 max-w-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Connect with global opportunities for internships and language exchange
      </motion.p>

      <motion.div
        className="space-y-4 w-full max-w-xs mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <UserTypeButton
          icon={<Languages className="h-5 w-5" />}
          title="I'm a Student"
          description="Looking for internships & language practice"
          onClick={() => onContinue("student")}
        />

        <UserTypeButton
          icon={<Briefcase className="h-5 w-5" />}
          title="I'm a Business"
          description="Seeking interns & language exchange"
          onClick={() => onContinue("business")}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onGuestContinue}
          className="flex items-center gap-1 text-muted-foreground"
        >
          <User className="h-4 w-4" />
          Explore as Guest
        </Button>
      </motion.div>
    </div>
  )
}

function UserTypeButton({ icon, title, description, onClick }) {
  return (
    <motion.button
      className="w-full flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card hover:bg-card/80 text-left"
      onClick={onClick}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
        borderColor: "rgba(59, 130, 246, 0.5)",
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </motion.button>
  )
}
