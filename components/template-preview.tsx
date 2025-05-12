"use client"

import { useState } from "react"
import { Download, FileText, Calendar, Clock, Languages, Briefcase, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { AgreementTemplate } from "@/types/agreement-templates"

interface TemplatePreviewProps {
  template: AgreementTemplate
  values: Record<string, any>
  onDownload: () => void
  onSign: () => void
  confirmButtonText?: string
}

export function TemplatePreview({
  template,
  values,
  onDownload,
  onSign,
  confirmButtonText = "Sign Agreement",
}: TemplatePreviewProps) {
  const [agreed, setAgreed] = useState(false)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "Languages":
        return <Languages className="h-4 w-4 text-muted-foreground" />
      case "Briefcase":
        return <Briefcase className="h-4 w-4 text-muted-foreground" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 border border-border/40">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{template.name}</h3>
            <p className="text-sm text-muted-foreground">
              {values.internName && values.organizationName
                ? `${values.organizationName} & ${values.internName}`
                : "Internship Arrangement"}
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={onDownload}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Header Information */}
          <div>
            <h4 className="font-medium">Arrangement Details</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {values.position && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{values.position}</span>
                </div>
              )}
              {values.startDate && values.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(values.startDate)} - {formatDate(values.endDate)}
                  </span>
                </div>
              )}
              {values.hoursPerWeek && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{values.hoursPerWeek} hours/week</span>
                </div>
              )}
              {values.workArrangement && (
                <div className="flex items-center gap-2">
                  {getIconComponent(template.icon)}
                  <span>{values.workArrangement.charAt(0).toUpperCase() + values.workArrangement.slice(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Parties Section */}
          {template.sections.find((s) => s.id === "parties") && (
            <div>
              <h4 className="font-medium">Parties</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <h5 className="text-sm font-medium">Intern</h5>
                  <p className="text-muted-foreground">{values.internName || "Not specified"}</p>
                  {values.internEmail && <p className="text-muted-foreground">{values.internEmail}</p>}
                </div>
                <div>
                  <h5 className="text-sm font-medium">Organization</h5>
                  <p className="text-muted-foreground">{values.organizationName || "Not specified"}</p>
                  {values.organizationAddress && (
                    <p className="text-muted-foreground whitespace-pre-line">{values.organizationAddress}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Language Exchange Section */}
          {template.id === "language-exchange" && values.internNativeLanguage && (
            <div>
              <h4 className="font-medium">Language Exchange</h4>
              <div className="mt-2 text-muted-foreground">
                <p>
                  <strong>Intern's Native Language:</strong>{" "}
                  {values.internNativeLanguage.charAt(0).toUpperCase() + values.internNativeLanguage.slice(1)}
                </p>
                <p>
                  <strong>Intern's Target Language:</strong>{" "}
                  {values.internTargetLanguage.charAt(0).toUpperCase() + values.internTargetLanguage.slice(1)}
                </p>
                {values.languageExchangeHours && (
                  <p>
                    <strong>Language Exchange Hours:</strong> {values.languageExchangeHours} hours per week
                  </p>
                )}
                {values.languageExchangeFormat && (
                  <p>
                    <strong>Format:</strong>{" "}
                    {values.languageExchangeFormat.charAt(0).toUpperCase() +
                      values.languageExchangeFormat.slice(1).replace(/-/g, " ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Project Details Section */}
          {template.id === "project-based" && values.projectTitle && (
            <div>
              <h4 className="font-medium">Project Details</h4>
              <div className="mt-2 text-muted-foreground">
                <p>
                  <strong>Project Title:</strong> {values.projectTitle}
                </p>
                {values.projectManager && (
                  <p>
                    <strong>Project Manager:</strong> {values.projectManager}
                  </p>
                )}
                {values.projectDescription && (
                  <p className="mt-1">
                    <strong>Description:</strong> {values.projectDescription}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Responsibilities Section */}
          {values.duties && (
            <div>
              <h4 className="font-medium">Responsibilities</h4>
              <div className="mt-2 text-muted-foreground whitespace-pre-line">{values.duties}</div>
            </div>
          )}

          {/* Compensation Section */}
          {values.compensationType && (
            <div>
              <h4 className="font-medium">Compensation</h4>
              <div className="mt-2 text-muted-foreground">
                <p>
                  <strong>Type:</strong>{" "}
                  {values.compensationType.charAt(0).toUpperCase() +
                    values.compensationType.slice(1).replace(/-/g, " ")}
                </p>
                {values.compensationDetails && <p className="whitespace-pre-line">{values.compensationDetails}</p>}
              </div>
            </div>
          )}

          {/* Terms Section */}
          <div className="pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-sm cursor-pointer">
                I acknowledge that this is a template only and that Langtern is not a party to this arrangement
              </label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-4">
        <Button onClick={onSign} disabled={!agreed} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {confirmButtonText} <CheckCircle className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
