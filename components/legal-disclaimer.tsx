"use client"

import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LegalDisclaimerProps {
  variant?: "default" | "compact" | "minimal"
}

export function LegalDisclaimer({ variant = "default" }: LegalDisclaimerProps) {
  if (variant === "minimal") {
    return (
      <p className="text-xs text-muted-foreground mt-1">
        Langtern provides templates as guidelines only. We are not a party to any arrangements between users.
      </p>
    )
  }

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Langtern is a matching platform only. We do not enforce, monitor, or validate arrangements between users.
          Users are solely responsible for all aspects of their arrangements.
        </p>
      </div>
    )
  }

  return (
    <Alert variant="default" className="bg-muted/50 border-muted-foreground/20">
      <Info className="h-4 w-4" />
      <AlertTitle>Platform Disclaimer</AlertTitle>
      <AlertDescription className="text-sm">
        <p className="mb-2">
          Langtern serves as a matching platform only. We provide templates and guidelines as a convenience, but we are
          not a party to any arrangements between users.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Users are solely responsible for negotiating and finalizing their own arrangements</li>
          <li>We do not enforce, monitor, or validate the terms of any arrangement</li>
          <li>
            Templates are provided as suggestions only and should not be considered legal advice or legally binding
            documents
          </li>
          <li>Users should consult legal professionals for advice on specific arrangements</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
