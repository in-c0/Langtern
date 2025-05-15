"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function ProfileLayout({ children }) {
  const router = useRouter()

  const handleGoToHome = () => {
    router.push("/")
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-start p-4 pt-8">
      {/* Navigation Bar */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleGoBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoToHome}
          className="flex items-center gap-1 text-green-500 border-green-500"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
