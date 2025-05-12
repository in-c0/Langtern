"use client"

import { useState } from "react"
import { Languages, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// List of available languages (full names)
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
]

export function TranslationToggle({ enabled, onToggle }) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="translation-toggle" checked={enabled} onCheckedChange={onToggle} size="sm" />
      <Label htmlFor="translation-toggle" className="text-xs cursor-pointer">
        Translation
      </Label>
    </div>
  )
}

export function TranslationStatus({ active }) {
  if (!active) return null

  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      <span>Translating...</span>
    </div>
  )
}

export function TranslationSettingsDialog({ settings, onUpdateSettings }) {
  const [open, setOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onUpdateSettings(localSettings)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Languages className="h-3 w-3 mr-1" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Translation Settings</DialogTitle>
          <DialogDescription>Configure how messages are translated between you and your partner.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="your-language" className="text-right">
              Your language
            </Label>
            <Select
              value={localSettings.userLanguage}
              onValueChange={(value) => setLocalSettings({ ...localSettings, userLanguage: value })}
            >
              <SelectTrigger id="your-language" className="col-span-3">
                <SelectValue placeholder="Select language" />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="partner-language" className="text-right">
              Partner language
            </Label>
            <Select
              value={localSettings.partnerLanguage}
              onValueChange={(value) => setLocalSettings({ ...localSettings, partnerLanguage: value })}
            >
              <SelectTrigger id="partner-language" className="col-span-3">
                <SelectValue placeholder="Select language" />
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auto-detect" className="text-right">
              Auto-detect
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="auto-detect"
                checked={localSettings.autoDetect}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoDetect: checked })}
              />
              <Label htmlFor="auto-detect" className="text-sm text-muted-foreground">
                Automatically detect message language
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
