"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { ApiStatusChecker } from "@/components/api-status-checker"

export function WelcomeScreen() {
  const [activeTab, setActiveTab] = useState("login")

  const handleSuccess = () => {
    // Redirect to profile creation or dashboard
    window.location.href = "/profile"
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700">Langtern</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with language exchange opportunities and internships worldwide
          </p>
        </div>

        <ApiStatusChecker />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to Langtern's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
