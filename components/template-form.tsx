"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AgreementTemplate, TemplateField } from "@/types/agreement-templates"

interface TemplateFormProps {
  template: AgreementTemplate
  initialValues?: Record<string, any>
  onChange: (values: Record<string, any>) => void
}

export function TemplateForm({ template, initialValues = {}, onChange }: TemplateFormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues || template.sampleValues || {})
  const [expandedSections, setExpandedSections] = useState<string[]>([template.sections[0]?.id || ""])

  const handleValueChange = (fieldId: string, value: any) => {
    const newValues = { ...values, [fieldId]: value }
    setValues(newValues)
    onChange(newValues)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const expandAllSections = () => {
    setExpandedSections(template.sections.map((section) => section.id))
  }

  const collapseAllSections = () => {
    setExpandedSections([])
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{template.name}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAllSections}>
            <ChevronDown className="h-4 w-4 mr-1" /> Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAllSections}>
            <ChevronUp className="h-4 w-4 mr-1" /> Collapse All
          </Button>
        </div>
      </div>

      <Accordion type="multiple" value={expandedSections} className="w-full">
        {template.sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger
              onClick={(e) => {
                e.preventDefault()
                toggleSection(section.id)
              }}
              className="hover:no-underline"
            >
              <div className="flex flex-col items-start">
                <span>{section.title}</span>
                {section.description && (
                  <span className="text-sm text-muted-foreground font-normal">{section.description}</span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 py-3">
                {section.fields.map((field) => (
                  <FormField
                    key={field.id}
                    field={field}
                    value={values[field.id]}
                    onChange={(value) => handleValueChange(field.id, value)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

interface FormFieldProps {
  field: TemplateField
  value: any
  onChange: (value: any) => void
}

function FormField({ field, value, onChange }: FormFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        )
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="min-h-[100px]"
          />
        )
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        )
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id} checked={value || false} onCheckedChange={onChange} required={field.required} />
            {field.description && <span className="text-sm text-muted-foreground">{field.description}</span>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.description && field.type !== "checkbox" && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
      {field.validation?.message && <p className="text-xs text-muted-foreground">{field.validation.message}</p>}
    </div>
  )
}
