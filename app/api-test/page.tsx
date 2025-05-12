import { ApiConnectionTest } from "@/components/api-connection-test"
import { TranslationTester } from "@/components/translation-tester"

export default function ApiTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">API Testing</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          <ApiConnectionTest />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Translation API</h2>
          <TranslationTester />
        </section>
      </div>
    </div>
  )
}
