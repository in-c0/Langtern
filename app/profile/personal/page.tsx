import { ProtectedRoute } from "@/components/protected-route"
import { PersonalInformation } from "@/components/personal-information"

export default function PersonalInformationPage() {
  return (
    <div className="min-h-screen p-4 pt-8">
      <ProtectedRoute>
        <PersonalInformation />
      </ProtectedRoute>
    </div>
  )
}
