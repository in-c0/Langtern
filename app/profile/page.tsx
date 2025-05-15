import { UserProfile } from "@/components/user-profile"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    </div>
  )
}
