import { ProtectedRoute } from "@/components/protected-route"
import { UnifiedMessageCenter } from "@/components/unified-message-center"

export default function MessagesPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <UnifiedMessageCenter mode="standalone" />
      </ProtectedRoute>
    </div>
  )
}
