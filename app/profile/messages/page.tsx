import { ProtectedRoute } from "@/components/protected-route"
import { MessageCenter } from "@/components/message-center"

export default function MessagesPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <MessageCenter />
      </ProtectedRoute>
    </div>
  )
}
