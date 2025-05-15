import { ProtectedRoute } from "@/components/protected-route"
import { NotificationSettings } from "@/components/notification-settings"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <NotificationSettings />
      </ProtectedRoute>
    </div>
  )
}
