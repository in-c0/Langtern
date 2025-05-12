import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Langtern Platform API</CardTitle>
            <CardDescription>
              Connecting students with language skills to businesses needing localization help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Authentication Endpoints</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/register</code> - Register a new user
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/login</code> - Authenticate a user
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/me</code> - Get authenticated user profile
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Profile Management</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/profile</code> - Get or update user profile
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/profile/languages</code> - Manage user
                    languages
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/profile/skills</code> - Manage user skills
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Job Management</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/jobs</code> - Search and filter job listings
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/applications</code> - Apply for jobs and manage
                    applications
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/api/arrangements</code> - Manage finalized job
                    arrangements
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">AI Services</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/translate</code> - Translate text using Gemini AI
                  </li>
                  <li>
                    <code className="bg-gray-100 px-2 py-1 rounded">/searchJob</code> - Find job matches based on skills
                    and languages
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  Langtern connects students seeking real-world experience with small businesses needing affordable help
                  with localization, combining internship opportunities with language exchange.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
