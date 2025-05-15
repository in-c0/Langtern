"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [settings, setSettings] = useState({
    emailNotifications: true,
    newMessages: true,
    matchAlerts: true,
    internshipUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call to update notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how and when you receive notifications</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>

              <div className="flex items-center justify-between pl-6">
                <div className="space-y-0.5">
                  <Label htmlFor="new-messages">New Messages</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                </div>
                <Switch
                  id="new-messages"
                  checked={settings.newMessages}
                  onCheckedChange={() => handleToggle("newMessages")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between pl-6">
                <div className="space-y-0.5">
                  <Label htmlFor="match-alerts">Match Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new potential matches</p>
                </div>
                <Switch
                  id="match-alerts"
                  checked={settings.matchAlerts}
                  onCheckedChange={() => handleToggle("matchAlerts")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between pl-6">
                <div className="space-y-0.5">
                  <Label htmlFor="internship-updates">Internship Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about your active internships</p>
                </div>
                <Switch
                  id="internship-updates"
                  checked={settings.internshipUpdates}
                  onCheckedChange={() => handleToggle("internshipUpdates")}
                  disabled={!settings.emailNotifications}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Other Communications</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of activity and opportunities
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={() => handleToggle("weeklyDigest")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={settings.marketingEmails}
                  onCheckedChange={() => handleToggle("marketingEmails")}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
