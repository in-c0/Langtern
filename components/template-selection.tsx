"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Languages, Briefcase, CheckCircle, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AGREEMENT_TEMPLATES } from "@/data/agreement-templates"
import type { AgreementTemplate } from "@/types/agreement-templates"

interface TemplateSelectionProps {
  onSelectTemplate: (template: AgreementTemplate) => void
  selectedTemplateId?: string
}

export function TemplateSelection({ onSelectTemplate, selectedTemplateId }: TemplateSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = AGREEMENT_TEMPLATES.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5" />
      case "Languages":
        return <Languages className="h-5 w-5" />
      case "Briefcase":
        return <Briefcase className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={template.id === selectedTemplateId}
              onSelect={() => onSelectTemplate(template)}
              icon={getIconComponent(template.icon)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No templates found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: AgreementTemplate
  isSelected: boolean
  onSelect: () => void
  icon: React.ReactNode
}

function TemplateCard({ template, isSelected, onSelect, icon }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`p-4 border cursor-pointer ${
          isSelected ? "border-blue-500/50 bg-blue-500/5" : "border-border/40 hover:border-blue-500/30"
        }`}
        onClick={onSelect}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{template.name}</h3>
              {isSelected && <CheckCircle className="h-4 w-4 text-blue-500" />}
            </div>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
