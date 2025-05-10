"use client"

import { useState } from "react"
import { Languages, Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { TranslationSettings } from "@/hooks/use-translation"

const LANGUAGES = [
  "English",
  "Japanese",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Korean",
  "Portuguese",
  "Italian",
  "Russian",
  "Arabic",
]

interface TranslationSettingsProps {
  settings: TranslationSettings
  onUpdateSettings: (settings: Partial<TranslationSettings>) => void
}

export function TranslationSettingsDialog({ settings, onUpdateSettings }: TranslationSettingsProps) {
  const [open, setOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState<TranslationSettings>(settings)

  const handleSave = () => {
    onUpdateSettings(localSettings)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Translation Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Translation Settings</DialogTitle>
          <DialogDescription>Configure how messages are translated in your conversations</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="translation-toggle" className="text-sm font-medium">
                Enable Translation
              </Label>
              <span className="text-xs text-muted-foreground">Automatically translate messages between languages</span>
            </div>
            <Switch
              id="translation-toggle"
              checked={localSettings.enabled}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enabled: checked })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="your-language" className="text-sm">
              Your Language
            </Label>
            <Select
              value={localSettings.userLanguage}
              onValueChange={(value) => setLocalSettings({ ...localSettings, userLanguage: value })}
            >
              <SelectTrigger id="your-language">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="partner-language" className="text-sm">
              Partner's Language
            </Label>
            <Select
              value={localSettings.partnerLanguage}
              onValueChange={(value) => setLocalSettings({ ...localSettings, partnerLanguage: value })}
            >
              <SelectTrigger id="partner-language">
                <SelectValue placeholder="Select partner's language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="auto-detect" className="text-sm font-medium">
                Auto-detect Language
              </Label>
              <span className="text-xs text-muted-foreground">
                Automatically detect the language of incoming messages
              </span>
            </div>
            <Switch
              id="auto-detect"
              checked={localSettings.autoDetect}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoDetect: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TranslationToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 gap-1.5 ${enabled ? "text-blue-500" : "text-muted-foreground"}`}
      onClick={onToggle}
    >
      <Languages className="h-4 w-4" />
      {enabled ? <span className="text-xs">Translation On</span> : <span className="text-xs">Translation Off</span>}
    </Button>
  )
}

export function TranslationStatus({ active }: { active: boolean }) {
  return active ? (
    <div className="flex items-center gap-1 text-xs text-blue-500 animate-pulse">
      <Languages className="h-3 w-3" />
      <span>Translating...</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 text-xs text-green-500">
      <Check className="h-3 w-3" />
      <span>Translation ready</span>
    </div>
  )
}
