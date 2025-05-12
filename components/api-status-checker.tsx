"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

export function ApiStatusChecker() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")
  // Always use the remote API URL
  const apiUrl = "https://langtern.vercel.app"

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        console.log(`Checking API status at: ${apiUrl}/api/languages`)

        // Try to fetch the languages endpoint as a health check
        const response = await fetch(`${apiUrl}/api/languages`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((error) => {
          console.error("API check error:", error)
          return null
        })

        clearTimeout(timeoutId)

        if (response) {
          console.log("API is online")
          setStatus("online")
        } else {
          console.log("API is offline")
          setStatus("offline")
        }
      } catch (error) {
        console.error("API status check failed:", error)
        setStatus("offline")
      }
    }

    checkApiStatus()
  }, [apiUrl])

  if (status === "checking") {
    return null
  }

  if (status === "online") {
    return (
      <Alert className="bg-green-50 border-green-200 mb-4">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">API Connected</AlertTitle>
        <AlertDescription className="text-green-700">
          Successfully connected to the Langtern API at {apiUrl}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>API Connection Failed</AlertTitle>
      <AlertDescription>
        Unable to connect to the Langtern API at {apiUrl}. Please ensure the API is available.
      </AlertDescription>
    </Alert>
  )
}
