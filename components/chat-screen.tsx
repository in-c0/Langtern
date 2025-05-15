"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Languages, ChevronRight, Loader2, Globe, Settings, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { useTranslation } from "@/hooks/use-translation"
import { translateText as apiTranslateText } from "@/lib/api-service"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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

interface Message {
  id: number
  sender: "me" | "them"
  text: string
  translation?: string
  time: string
  isTranslating?: boolean
  showTranslation?: boolean
}

export function ChatScreen({ onProceed }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "them",
      text: "こんにちは！Langternでのインターンシップに興味を持っていただきありがとうございます。",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "them",
      text: "マーケティングの経験はありますか？",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "Hello! Yes, I have some experience with digital marketing from my university projects. I'm very interested in learning more about marketing in the Japanese market.",
      time: "10:33 AM",
    },
    {
      id: 4,
      sender: "them",
      text: "素晴らしいです！私たちは現在、SNSマーケティングキャンペーンを計画しています。あなたのスキルが役立つでしょう。",
      time: "10:35 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "週に何時間くらい働けますか？",
      time: "10:36 AM",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)

  const {
    settings: translationSettings,
    isTranslating,
    updateSettings,
  } = useTranslation({
    userLanguage: "English",
    partnerLanguage: "Japanese",
  })

  const [localSettings, setLocalSettings] = useState({
    userLanguage: translationSettings.userLanguage,
    partnerLanguage: translationSettings.partnerLanguage,
  })

  // Update local settings when translation settings change
  useEffect(() => {
    setLocalSettings({
      userLanguage: translationSettings.userLanguage,
      partnerLanguage: translationSettings.partnerLanguage,
    })
  }, [translationSettings])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const saveSettings = () => {
    updateSettings(localSettings)
    setShowSettings(false)
  }

  const sendMessage = async () => {
    if (newMessage.trim() === "" || isSending) return

    setIsSending(true)

    // Add user message immediately
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      isTranslating: false,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    try {
      // Simulate reply after a delay
      if (messages.length === 5) {
        setTimeout(async () => {
          const replyText = "素晴らしいです！次のステップについて話し合いましょう。契約書を送ります。"

          // Add partner message
          const partnerMessage: Message = {
            id: messages.length + 2,
            sender: "them",
            text: replyText,
            isTranslating: false,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setMessages((prev) => [...prev, partnerMessage])
        }, 1500)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleTranslateMessage = async (messageId: number, text: string, targetLang: string) => {
    // Update the message to show loading state
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isTranslating: true,
            }
          : msg,
      ),
    )

    try {
      // Call the translation API
      const result = await apiTranslateText({
        text,
        targetLang,
      })

      // Update the message with the translation and toggle visibility
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                translation: result.translatedText,
                isTranslating: false,
                showTranslation: true,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error translating message:", error)
      // Update the message to remove loading state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                isTranslating: false,
              }
            : msg,
        ),
      )
    }
  }

  const toggleTranslationVisibility = (messageId: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              showTranslation: !msg.showTranslation,
            }
          : msg,
      ),
    )
  }

  return (
    <div className="py-2 h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-blue-500">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-full h-full flex items-center justify-center text-white font-medium">
              TS
            </div>
          </Avatar>
          <div>
            <h2 className="font-medium">Tokyo Tech Solutions</h2>
            <div className="flex items-center text-xs text-muted-foreground">
              <Languages className="h-3 w-3 mr-1" />
              Japanese, English
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onProceed}
          className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
        >
          Proceed <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onTranslate={() =>
              handleTranslateMessage(
                message.id,
                message.text,
                message.sender === "me" ? translationSettings.partnerLanguage : translationSettings.userLanguage,
              )
            }
            onToggleTranslation={() => toggleTranslationVisibility(message.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Inline Translation Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="mb-4 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex justify-between items-center">
                  Translation Settings
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor="your-language" className="text-xs">
                    Your language
                  </Label>
                  <Select
                    value={localSettings.userLanguage}
                    onValueChange={(value) => setLocalSettings({ ...localSettings, userLanguage: value })}
                  >
                    <SelectTrigger id="your-language" className="h-8 text-xs">
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
                <div className="grid gap-2">
                  <Label htmlFor="partner-language" className="text-xs">
                    Partner language
                  </Label>
                  <Select
                    value={localSettings.partnerLanguage}
                    onValueChange={(value) => setLocalSettings({ ...localSettings, partnerLanguage: value })}
                  >
                    <SelectTrigger id="partner-language" className="h-8 text-xs">
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
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <Button size="sm" className="w-full text-xs h-8" onClick={saveSettings}>
                  <Check className="h-3 w-3 mr-1" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-border/40 pt-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
            disabled={isSending}
          />
          <Button
            size="icon"
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            disabled={isSending || newMessage.trim() === ""}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs flex items-center gap-1.5"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-3.5 w-3.5" />
            {showSettings ? "Hide Settings" : "Translation Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message, onTranslate, onToggleTranslation }) {
  const isMe = message.sender === "me"

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-6`}>
      <motion.div
        className={`max-w-[80%] ${
          isMe ? "bg-blue-500 text-white rounded-t-lg rounded-bl-lg" : "bg-muted rounded-t-lg rounded-br-lg"
        } p-3 relative`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm">{message.text}</p>

        {message.isTranslating && (
          <div className="mt-1 flex items-center gap-1 text-xs opacity-70">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Translating...</span>
          </div>
        )}

        {message.translation && message.showTranslation && (
          <div className="mt-2 pt-2 border-t border-gray-200/20">
            <p className="text-sm italic opacity-90">{message.translation}</p>
          </div>
        )}

        <div className="absolute -bottom-6 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{message.time}</span>

          {message.translation ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full bg-background border border-border/40 hover:bg-background/90"
              onClick={onToggleTranslation}
              title={message.showTranslation ? "Hide translation" : "Show translation"}
            >
              <Globe className="h-3 w-3 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full bg-background border border-border/40 hover:bg-background/90"
              onClick={onTranslate}
              disabled={message.isTranslating}
              title="Translate message"
            >
              {message.isTranslating ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : (
                <Languages className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
