"use client"

import { motion } from "framer-motion"
import { Languages } from "lucide-react"

export function TranslationIndicator({ active = false }) {
  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-lg ${
        active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
      }`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Languages className="h-4 w-4" />
      <span>{active ? "Translation Active" : "Translation Off"}</span>

      {active && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500 opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </motion.div>
  )
}
