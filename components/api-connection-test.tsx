"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import api from "@/services/api"

export function ApiConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const testConnection = async () => {
    setStatus("loading")
    setMessage("")

    try {
      const response = await api.ai.testConnection()
      setStatus("success")
      setMessage(response.message || "Connection successful!")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Failed to connect to API")
      console.error("API connection error:", error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        {status === "idle" && (
          <p className="text-muted-foreground text-center">Click the button below to test the connection to the API</p>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p>Testing connection...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <p className="text-green-600 font-medium">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-600 font-medium">Connection failed</p>
            <p className="text-sm text-muted-foreground text-center">{message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test API Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
