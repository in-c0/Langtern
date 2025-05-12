export interface TemplateField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "date" | "number" | "checkbox"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  defaultValue?: string | string[] | boolean | number
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface TemplateSection {
  id: string
  title: string
  description?: string
  fields: TemplateField[]
}

export interface AgreementTemplate {
  id: string
  name: string
  description: string
  icon: string
  sections: TemplateSection[]
  sampleValues?: Record<string, any>
}

export interface AgreementValues {
  templateId: string
  values: Record<string, any>
}
