"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Loader2, Save, AlertCircle } from "lucide-react"
import api from "@/services/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true)
        setError(null)
        try {
          // First try to get the full profile
          try {
            const profileData = await api.profile.getFullProfile()
            setProfile(profileData)

            // Update form fields if profile data is available
            if (profileData.name) setName(profileData.name)
            if (profileData.email) setEmail(profileData.email)
          } catch (profileError: any) {
            console.error("Failed to fetch full profile:", profileError)

            // If full profile fails, try to get basic user info
            try {
              const userData = await api.auth.getProfile()
              setProfile({
                ...userData,
                languages: [],
                skills: [],
              })

              // Update form fields with basic user data
              if (userData.name) setName(userData.name)
              if (userData.email) setEmail(userData.email)
            } catch (userError: any) {
              console.error("Failed to fetch basic profile:", userError)
              // Use data from auth context as fallback
              setProfile({
                name: user.name,
                email: user.email,
                languages: [],
                skills: [],
              })
              setName(user.name)
              setEmail(user.email)

              // Show a non-blocking error message
              setError("Could not fetch your complete profile. Some information may be missing.")
            }
          }
        } catch (error: any) {
          console.error("All profile fetch attempts failed:", error)
          setError("Failed to load profile data. Please try again later.")
        } finally {
          setLoading(false)
        }
      }

      fetchProfile()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage("")

    try {
      // Try to update the profile using the profile API
      try {
        await api.profile.updateProfile({ name })
        setSaveMessage("Profile updated successfully!")
      } catch (profileError: any) {
        console.error("Failed to update profile with profile API:", profileError)

        // Fallback: Just update the UI state without API call
        setName(name)
        setSaveMessage("Profile updated locally. Some changes may not persist.")
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error)
      setSaveMessage("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {error && (
        <Alert variant="warning" className="mb-4 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {profile && profile.languages && profile.languages.length > 0 && (
              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang: any) => (
                    <div key={lang.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                      {lang.name} - {lang.proficiency_level}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile && profile.skills && profile.skills.length > 0 && (
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: any) => (
                    <div key={skill.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
                {saveMessage}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
