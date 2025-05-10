"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AIProviderSelectorProps {
  selectedProvider: "ai" | "openai" | "none"
  onSelectProvider: (provider: "ai" | "openai" | "none") => void
  feature?: "translation" | "matchmaking" | "all"
}

export function AIProviderSelector({ selectedProvider, onSelectProvider, feature = "all" }: AIProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const featureLabel =
    feature === "translation" ? "Translation" : feature === "matchmaking" ? "Matchmaking" : "AI Provider"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          {selectedProvider === "ai" ? "AI" : selectedProvider === "openai" ? "OpenAI" : "Select AI"}
          <span className="text-muted-foreground">for {featureLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose AI Provider</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <RadioGroup
            value={selectedProvider}
            onValueChange={(value) => {
              onSelectProvider(value as "ai" | "openai" | "none")
              setIsOpen(false)
            }}
          >
            <div className="p-2 space-y-2">
              <div
                className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                onClick={() => {
                  onSelectProvider("ai")
                  setIsOpen(false)
                }}
              >
                <RadioGroupItem value="ai" id="ai" />
                <Label htmlFor="ai" className="flex-1 cursor-pointer">
                  AI
                </Label>
                <div className="h-4 w-4 rounded-full bg-purple-500" />
              </div>

              <div
                className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                onClick={() => {
                  onSelectProvider("openai")
                  setIsOpen(false)
                }}
              >
                <RadioGroupItem value="openai" id="openai" />
                <Label htmlFor="openai" className="flex-1 cursor-pointer">
                  OpenAI
                </Label>
                <div className="h-4 w-4 rounded-full bg-blue-500" />
              </div>

              <div
                className="flex items-center space-x-2 p-2 rounded hover:bg-accent cursor-pointer"
                onClick={() => {
                  onSelectProvider("none")
                  setIsOpen(false)
                }}
              >
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="flex-1 cursor-pointer">
                  None (Disable AI)
                </Label>
                <div className="h-4 w-4 rounded-full bg-gray-500" />
              </div>
            </div>
          </RadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
