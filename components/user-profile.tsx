"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { LogOut, User, Settings, Bell, Briefcase, MessageSquare, Search, Home } from "lucide-react"

export function UserProfile() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  const handleGoToHome = () => {
    router.push("/")
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Get first letter of name for avatar
  const avatarText = user.firstName ? user.firstName[0].toUpperCase() : "U"

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {avatarText}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">{`${user.firstName} ${user.lastName}`}</CardTitle>
        <CardDescription>{user.email}</CardDescription>

        {/* Add Find Matches button */}
        <Button onClick={handleGoToHome} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
          <Search className="h-4 w-4 mr-2" />
          Find Matches
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <ProfileMenuItem
            icon={<User className="h-5 w-5 text-blue-500" />}
            title="Personal Information"
            description="Update your personal details"
            onClick={() => router.push("/profile/personal")}
          />

          <ProfileMenuItem
            icon={<Briefcase className="h-5 w-5 text-green-500" />}
            title="My Internships"
            description="View your current and past internships"
            onClick={() => router.push("/profile/internships")}
          />

          <ProfileMenuItem
            icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
            title="Messages"
            description="View your conversations"
            onClick={() => router.push("/profile/messages")}
          />

          <ProfileMenuItem
            icon={<Bell className="h-5 w-5 text-orange-500" />}
            title="Notifications"
            description="Manage your notification settings"
            onClick={() => router.push("/profile/notifications")}
          />

          <ProfileMenuItem
            icon={<Settings className="h-5 w-5 text-gray-500" />}
            title="Account Settings"
            description="Manage your account preferences"
            onClick={() => router.push("/profile/settings")}
          />

          <ProfileMenuItem
            icon={<Home className="h-5 w-5 text-blue-500" />}
            title="Return to Home"
            description="Go back to the main application"
            onClick={handleGoToHome}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProfileMenuItem({ icon, title, description, onClick }) {
  return (
    <button
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors w-full"
      onClick={onClick}
    >
      <div className="mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
