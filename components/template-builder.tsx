"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateSelection } from "@/components/template-selection"
import { TemplateForm } from "@/components/template-form"
import { TemplatePreview } from "@/components/template-preview"
import { AgreementConfirmation } from "@/components/agreement-confirmation"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import type { AgreementTemplate } from "@/types/agreement-templates"

interface TemplateBuilderProps {
  onComplete: () => void
}

export function TemplateBuilder({ onComplete }: TemplateBuilderProps) {
  const [activeTab, setActiveTab] = useState("template")
  const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleSelectTemplate = (template: AgreementTemplate) => {
    setSelectedTemplate(template)
    setFormValues(template.sampleValues || {})
    setActiveTab("customize")
  }

  const handleFormChange = (values: Record<string, any>) => {
    setFormValues(values)
  }

  const handleDownload = () => {
    console.log("Downloading arrangement template:", { template: selectedTemplate?.id, values: formValues })
    alert("Arrangement template downloaded successfully!")
  }

  const handleConfirm = () => {
    console.log("Confirming arrangement:", { template: selectedTemplate?.id, values: formValues })
    setIsConfirmed(true)
  }

  if (isConfirmed && selectedTemplate) {
    return (
      <AgreementConfirmation
        agreementData={{
          templateId: selectedTemplate.id,
          templateName: selectedTemplate.name,
          internName: formValues.internName,
          organizationName: formValues.organizationName,
          position: formValues.position,
          startDate: formValues.startDate,
          endDate: formValues.endDate,
        }}
        onContinue={onComplete}
      />
    )
  }

  return (
    <div className="py-2">
      <h2 className="text-xl font-semibold mb-1">Internship Arrangement Template</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create a template to help structure your internship arrangement
      </p>

      <LegalDisclaimer variant="default" />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="customize" disabled={!selectedTemplate}>
              Customize
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedTemplate}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">Choose a template for your arrangement</div>
            <TemplateSelection onSelectTemplate={handleSelectTemplate} selectedTemplateId={selectedTemplate?.id} />
            <LegalDisclaimer variant="compact" />
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">Customize your arrangement details</div>
            {selectedTemplate && (
              <TemplateForm template={selectedTemplate} initialValues={formValues} onChange={handleFormChange} />
            )}
            <LegalDisclaimer variant="minimal" />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">Review your arrangement template</div>
            {selectedTemplate && (
              <TemplatePreview
                template={selectedTemplate}
                values={formValues}
                onDownload={handleDownload}
                onSign={handleConfirm}
                confirmButtonText="Confirm Arrangement"
              />
            )}
            <LegalDisclaimer variant="compact" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
