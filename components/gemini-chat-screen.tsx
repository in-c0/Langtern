"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Languages, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGeminiTranslation } from "@/hooks/use-gemini-translation"
import { TranslationSettingsDialog, TranslationToggle, TranslationStatus } from "@/components/translation-settings"
import { AIProviderSelector } from "@/components/ai-provider-selector"

interface Message {
  id: number
  sender: "me" | "them"
  text: string
  translation?: string
  time: string
  isTranslating?: boolean
}

export function GeminiChatScreen({ onProceed }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "them",
      text: "こんにちは！Langternでのインターンシップに興味を持っていただきありがとうございます。",
      translation: "Hello! Thank you for your interest in the internship at Langtern.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "them",
      text: "マーケティングの経験はありますか？",
      translation: "Do you have any experience in marketing?",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "Hello! Yes, I have some experience with digital marketing from my university projects. I'm very interested in learning more about marketing in the Japanese market.",
      translation:
        "はい、大学のプロジェクトでデジタルマーケティングの経験があります。日本市場でのマーケティングについてもっと学びたいと思っています。",
      time: "10:33 AM",
    },
    {
      id: 4,
      sender: "them",
      text: "素晴らしいです！私たちは現在、SNSマーケティングキャンペーンを計画しています。あなたのスキルが役立つでしょう。",
      translation:
        "That's great! We are currently planning a social media marketing campaign. Your skills will be useful.",
      time: "10:35 AM",
    },
    {
      id: 5,
      sender: "them",
      text: "週に何時間くらい働けますか？",
      translation: "How many hours can you work per week?",
      time: "10:36 AM",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [aiProvider, setAiProvider] = useState<"ai" | "openai" | "none">("ai")

  const {
    settings: translationSettings,
    isTranslating,
    toggleTranslation,
    updateSettings,
    translateMessage,
  } = useGeminiTranslation({
    userLanguage: "English",
    partnerLanguage: "Japanese",
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (newMessage.trim() === "" || isSending) return

    setIsSending(true)

    // Add user message immediately with loading state for translation
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "me",
      text: newMessage,
      isTranslating: translationSettings.enabled,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    try {
      // Translate the message if translation is enabled
      if (translationSettings.enabled && aiProvider !== "none") {
        const result = await translateMessage(newMessage, translationSettings.partnerLanguage)

        // Update the message with translation
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? {
                  ...msg,
                  translation: result.translatedText,
                  isTranslating: false,
                }
              : msg,
          ),
        )
      }

      // Simulate reply after a delay
      if (messages.length === 5) {
        setTimeout(async () => {
          const replyText = "素晴らしいです！次のステップについて話し合いましょう。契約書を送ります。"

          // Add partner message with loading state for translation
          const partnerMessage: Message = {
            id: messages.length + 2,
            sender: "them",
            text: replyText,
            isTranslating: translationSettings.enabled,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setMessages((prev) => [...prev, partnerMessage])

          // Translate the partner's message
          if (translationSettings.enabled && aiProvider !== "none") {
            const result = await translateMessage(replyText, translationSettings.userLanguage)

            // Update the message with translation
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === partnerMessage.id
                  ? {
                      ...msg,
                      translation: result.translatedText,
                      isTranslating: false,
                    }
                  : msg,
              ),
            )
          }
        }, 1500)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleProviderChange = (provider: "ai" | "openai" | "none") => {
    setAiProvider(provider)
    if (provider === "none") {
      updateSettings({ enabled: false })
    } else {
      updateSettings({ enabled: true })
    }
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

      <div className="flex items-center justify-between mb-3">
        <AIProviderSelector
          selectedProvider={aiProvider}
          onSelectProvider={handleProviderChange}
          feature="translation"
        />
        <Badge
          variant="outline"
          className={`${
            aiProvider === "ai"
              ? "bg-purple-500/10 text-purple-500 border-purple-500/30"
              : aiProvider === "openai"
                ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                : "bg-gray-500/10 text-gray-500 border-gray-500/30"
          }`}
        >
          {aiProvider === "ai"
            ? "Powered by Gemini AI"
            : aiProvider === "openai"
              ? "Powered by OpenAI"
              : "AI Translation Disabled"}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            translationEnabled={translationSettings.enabled && aiProvider !== "none"}
            translationProvider={aiProvider}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

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
          <div className="flex items-center gap-2">
            <TranslationToggle
              enabled={translationSettings.enabled && aiProvider !== "none"}
              onToggle={toggleTranslation}
              disabled={aiProvider === "none"}
            />
            <TranslationSettingsDialog settings={translationSettings} onUpdateSettings={updateSettings} />
          </div>
          <TranslationStatus active={isTranslating || isSending} provider={aiProvider} />
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message, translationEnabled, translationProvider }) {
  const isMe = message.sender === "me"

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
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
            <span>Translating with {translationProvider === "ai" ? "AI" : "OpenAI"}...</span>
          </div>
        )}

        {translationEnabled && message.translation && !message.isTranslating && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className={`absolute -bottom-6 ${
                    isMe ? "right-0" : "left-0"
                  } bg-background border-border/40 text-xs cursor-help ${
                    translationProvider === "ai" ? "text-purple-500" : "text-blue-500"
                  }`}
                >
                  <Languages className="h-3 w-3 mr-1" />
                  {translationProvider === "ai" ? "AI" : "OpenAI"} Translation
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{message.translation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <span className="absolute -bottom-6 text-xs text-muted-foreground">{message.time}</span>
      </motion.div>
    </div>
  )
}
