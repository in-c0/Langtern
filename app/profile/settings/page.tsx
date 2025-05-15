import { ProtectedRoute } from "@/components/protected-route"
import { AccountSettings } from "@/components/account-settings"

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <AccountSettings />
      </ProtectedRoute>
    </div>
  )
}
