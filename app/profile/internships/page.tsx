import { ProtectedRoute } from "@/components/protected-route"
import { InternshipsList } from "@/components/internships-list"

export default function InternshipsPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <InternshipsList />
      </ProtectedRoute>
    </div>
  )
}
