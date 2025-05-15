"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Key, Mail, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AccountSettings() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [isUpdating, setIsUpdating] = useState(false)

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>You need to be logged in to access account settings.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")}>Go to Login</Button>
        </CardFooter>
      </Card>
    )
  }

  const handleUpdateProfile = async () => {
    setError(null)
    setSuccess(null)
    setIsUpdating(true)

    // This would be where you'd call an API to update the user's profile
    // For now, we'll just simulate a successful update
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Profile updated successfully")
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async () => {
    setError(null)
    setSuccess(null)

    // Validate passwords
    if (!currentPassword) {
      setError("Current password is required")
      return
    }

    if (!newPassword) {
      setError("New password is required")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsUpdating(true)

    // This would be where you'd call an API to change the password
    // For now, we'll just simulate a successful password change
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Password changed successfully")
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Failed to change password")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Account Settings</CardTitle>
        <CardDescription>Manage your account settings and profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 mt-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center gap-3 w-full">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">Email Address</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Personal Information
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Security Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your password and security preferences</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 mt-4">
              <div className="space-y-4 border rounded-lg p-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Change Password
                  </h4>
                  <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleChangePassword} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Change Password"}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Account Actions</h4>
                  <p className="text-sm text-muted-foreground">Sign out or perform other account actions</p>
                </div>

                <div className="mt-4">
                  <Button variant="destructive" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => router.push("/profile")}>
          Back to Profile
        </Button>
        <Button onClick={handleUpdateProfile} disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
