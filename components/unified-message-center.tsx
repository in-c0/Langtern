"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Languages,
  ChevronRight,
  Loader2,
  Globe,
  Settings,
  X,
  Check,
  RefreshCw,
  Search,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "@/hooks/use-translation"
import { translateText as apiTranslateText } from "@/lib/api-service"

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
  senderId: string | number
  text: string
  translation?: string
  translatedTo?: string
  timestamp: string
  isTranslating?: boolean
  showTranslation?: boolean
}

interface Conversation {
  id: number
  contact: {
    id: number | string
    name: string
    avatar: string
    languages?: string[]
  }
  lastMessage: {
    text: string
    timestamp: string
    isRead: boolean
  }
  unreadCount: number
  messages: Message[]
}

// Sample data - would come from API in real implementation
const sampleConversations: Conversation[] = [
  {
    id: 1,
    contact: {
      id: 101,
      name: "Tokyo Tech Solutions",
      avatar: "T",
      languages: ["Japanese", "English"],
    },
    lastMessage: {
      text: "Thanks for your application! We'd like to schedule an interview.",
      timestamp: "10:30 AM",
      isRead: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 1,
        senderId: 101,
        text: "こんにちは！Langternでのインターンシップに興味を持っていただきありがとうございます。",
        timestamp: "May 12, 10:15 AM",
      },
      {
        id: 2,
        senderId: "me",
        text: "Hello! Yes, I have some experience with digital marketing from my university projects. I'm very interested in learning more about marketing in the Japanese market.",
        timestamp: "May 12, 10:20 AM",
      },
      {
        id: 3,
        senderId: 101,
        text: "マーケティングの経験はありますか？",
        timestamp: "May 12, 10:25 AM",
      },
      {
        id: 4,
        senderId: 101,
        text: "素晴らしいです！私たちは現在、SNSマーケティングキャンペーンを計画しています。あなたのスキルが役立つでしょう。",
        timestamp: "May 12, 10:30 AM",
      },
      {
        id: 5,
        senderId: 101,
        text: "週に何時間くらい働けますか？",
        timestamp: "May 12, 10:35 AM",
      },
      {
        id: 6,
        senderId: "me",
        text: "I can work about 15-20 hours per week. My schedule is flexible.",
        timestamp: "May 12, 10:40 AM",
      },
      {
        id: 7,
        senderId: 101,
        text: "素晴らしいです！次のステップについて話し合いましょう。契約書を送ります。",
        timestamp: "May 12, 10:45 AM",
      },
    ],
  },
  {
    id: 2,
    contact: {
      id: 102,
      name: "Tech Innovators",
      avatar: "T",
      languages: ["English", "Spanish"],
    },
    lastMessage: {
      text: "How's your progress on the project?",
      timestamp: "Yesterday",
      isRead: false,
    },
    unreadCount: 2,
    messages: [
      {
        id: 1,
        senderId: 102,
        text: "Welcome to the team! We're excited to have you join our project.",
        timestamp: "May 5, 9:00 AM",
      },
      {
        id: 2,
        senderId: "me",
        text: "Thank you! I'm looking forward to working with everyone.",
        timestamp: "May 5, 9:15 AM",
      },
      {
        id: 3,
        senderId: 102,
        text: "Here's the project brief and timeline. Let me know if you have questions.",
        timestamp: "May 5, 9:30 AM",
      },
      {
        id: 4,
        senderId: "me",
        text: "I've reviewed the materials. Everything looks clear!",
        timestamp: "May 8, 11:45 AM",
      },
      {
        id: 5,
        senderId: 102,
        text: "How's your progress on the project?",
        timestamp: "May 11, 2:30 PM",
      },
    ],
  },
  {
    id: 3,
    contact: {
      id: 103,
      name: "Global Solutions",
      avatar: "G",
      languages: ["English", "German"],
    },
    lastMessage: {
      text: "We've reviewed your application and would like to discuss next steps.",
      timestamp: "May 10",
      isRead: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 1,
        senderId: 103,
        text: "Hello! We noticed your profile and think you might be a good fit for our translation internship.",
        timestamp: "May 1, 3:15 PM",
      },
      {
        id: 2,
        senderId: "me",
        text: "Hi! Thank you for reaching out. I'd love to learn more about the opportunity.",
        timestamp: "May 1, 4:00 PM",
      },
      {
        id: 3,
        senderId: 103,
        text: "Great! The position involves translating marketing materials from English to German. Are you fluent in both languages?",
        timestamp: "May 2, 9:30 AM",
      },
      {
        id: 4,
        senderId: "me",
        text: "Yes, I'm fluent in both English and German. I also have experience with marketing content.",
        timestamp: "May 2, 10:15 AM",
      },
      {
        id: 5,
        senderId: 103,
        text: "We've reviewed your application and would like to discuss next steps.",
        timestamp: "May 10, 11:00 AM",
      },
    ],
  },
]

interface UnifiedMessageCenterProps {
  mode?: "standalone" | "flow"
  initialConversationId?: number
  onProceed?: () => void
  showBackButton?: boolean
  recipientName?: string
  recipientId?: string
}

export function UnifiedMessageCenter({
  mode = "standalone",
  initialConversationId,
  onProceed,
  showBackButton = true,
  recipientName = "Chat Partner",
  recipientId = "default-id",
}: UnifiedMessageCenterProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [activeConversation, setActiveConversation] = useState<number | null>(initialConversationId || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [recipient, setRecipient] = useState(recipientName)

  // Initialize translation settings with default values
  const defaultTranslationSettings = {
    userLanguage: "English",
    partnerLanguage: "Japanese",
    enabled: true,
    autoDetect: true,
  }

  // Properly call the hook at the top level of the component
  const { settings: translationSettings, isTranslating, updateSettings } = useTranslation(defaultTranslationSettings)

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

  // Scroll to bottom when messages change or conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation, conversations])

  const filteredConversations = conversations.filter((convo) =>
    convo.contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeConversationData = activeConversation ? conversations.find((c) => c.id === activeConversation) : null

  const saveSettings = () => {
    updateSettings(localSettings)
    setShowSettings(false)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return
    setIsSending(true)

    // Create a new message
    const newMessageObj: Message = {
      id: Date.now(),
      senderId: "me",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    // Update the conversations state
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        convo.id === activeConversation
          ? {
              ...convo,
              messages: [...convo.messages, newMessageObj],
              lastMessage: {
                text: newMessage,
                timestamp: "Just now",
                isRead: true,
              },
            }
          : convo,
      ),
    )

    // Clear the input
    setNewMessage("")

    // Simulate a reply after a delay
    setTimeout(() => {
      const activeConvo = conversations.find((c) => c.id === activeConversation)
      if (!activeConvo) return

      // Create a reply message
      const replyText =
        activeConvo.contact.id === 101
          ? "素晴らしいです！詳細を確認して連絡します。"
          : "Thanks for your message. I'll get back to you soon."

      const replyMessage: Message = {
        id: Date.now() + 1,
        senderId: activeConvo.contact.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Update the conversations state with the reply
      setConversations((prevConversations) =>
        prevConversations.map((convo) =>
          convo.id === activeConversation
            ? {
                ...convo,
                messages: [...convo.messages, replyMessage],
                lastMessage: {
                  text: replyText,
                  timestamp: "Just now",
                  isRead: true,
                },
              }
            : convo,
        ),
      )

      setIsSending(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTranslateMessage = async (
    conversationId: number,
    messageId: number,
    text: string,
    targetLang: string,
  ) => {
    // Update the message to show loading state
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        convo.id === conversationId
          ? {
              ...convo,
              messages: convo.messages.map((msg) => (msg.id === messageId ? { ...msg, isTranslating: true } : msg)),
            }
          : convo,
      ),
    )

    try {
      // Call the translation API
      const result = await apiTranslateText({
        text,
        targetLang,
      })

      // Update the message with the translation
      setConversations((prevConversations) =>
        prevConversations.map((convo) =>
          convo.id === conversationId
            ? {
                ...convo,
                messages: convo.messages.map((msg) =>
                  msg.id === messageId
                    ? {
                        ...msg,
                        translation: result.translatedText,
                        translatedTo: targetLang,
                        isTranslating: false,
                        showTranslation: true,
                      }
                    : msg,
                ),
              }
            : convo,
        ),
      )
    } catch (error) {
      console.error("Error translating message:", error)

      // Update the message to remove loading state
      setConversations((prevConversations) =>
        prevConversations.map((convo) =>
          convo.id === conversationId
            ? {
                ...convo,
                messages: convo.messages.map((msg) => (msg.id === messageId ? { ...msg, isTranslating: false } : msg)),
              }
            : convo,
        ),
      )
    }
  }

  const toggleTranslationVisibility = (conversationId: number, messageId: number) => {
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        convo.id === conversationId
          ? {
              ...convo,
              messages: convo.messages.map((msg) =>
                msg.id === messageId ? { ...msg, showTranslation: !msg.showTranslation } : msg,
              ),
            }
          : convo,
      ),
    )
  }

  // If there's an error, display it
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    )
  }

  // Render different layouts based on mode
  if (mode === "flow") {
    // Simplified view for the main flow
    return (
      <div className="py-2 h-[500px] flex flex-col">
        {activeConversationData && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-blue-500">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {activeConversationData.contact.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{activeConversationData.contact.name}</h2>
                  {activeConversationData.contact.languages && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Languages className="h-3 w-3 mr-1" />
                      {activeConversationData.contact.languages.join(", ")}
                    </div>
                  )}
                </div>
              </div>
              {onProceed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onProceed}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                >
                  Proceed <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-8 pr-1">
              {activeConversationData.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  currentLanguageSettings={{
                    userLanguage: translationSettings.userLanguage,
                    partnerLanguage: translationSettings.partnerLanguage,
                  }}
                  onTranslate={() =>
                    handleTranslateMessage(
                      activeConversation,
                      message.id,
                      message.text,
                      message.senderId === "me"
                        ? translationSettings.partnerLanguage
                        : translationSettings.userLanguage,
                    )
                  }
                  onToggleTranslation={() => toggleTranslationVisibility(activeConversation, message.id)}
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
                  onKeyDown={handleKeyPress}
                  className="flex-1"
                  disabled={isSending}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
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
          </>
        )}
      </div>
    )
  }

  // Full standalone mode with conversation list
  return (
    <div className="max-w-6xl mx-auto">
      {showBackButton && (
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>
      )}

      <Card className="h-[calc(100vh-150px)] min-h-[500px]">
        <CardHeader className="pb-4">
          <CardTitle>Messages</CardTitle>
          <CardDescription>Communicate with your internship contacts</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-76px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversation List */}
            <div className="border-r border-border">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="h-[calc(100%-60px)]">
                <div className="space-y-1 p-2">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeConversation === conversation.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {conversation.contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.contact.name}</p>
                              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                {conversation.lastMessage.timestamp}
                              </span>
                            </div>
                            <p
                              className={`text-sm truncate ${
                                !conversation.lastMessage.isRead ? "font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {conversation.lastMessage.text}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground flex-shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No conversations found</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Message Area */}
            <div className="col-span-2 flex flex-col h-full overflow-hidden">
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {activeConversationData?.contact.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="font-medium">{activeConversationData?.contact.name}</p>
                        {activeConversationData?.contact.languages && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Languages className="h-3 w-3 mr-1" />
                            {activeConversationData.contact.languages.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
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

                  {/* Translation Settings */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-b border-border"
                      >
                        <div className="p-4 bg-muted/30">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="your-language-full" className="text-xs">
                                Your language
                              </Label>
                              <Select
                                value={localSettings.userLanguage}
                                onValueChange={(value) => setLocalSettings({ ...localSettings, userLanguage: value })}
                              >
                                <SelectTrigger id="your-language-full" className="h-8 text-xs">
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
                              <Label htmlFor="partner-language-full" className="text-xs">
                                Partner language
                              </Label>
                              <Select
                                value={localSettings.partnerLanguage}
                                onValueChange={(value) =>
                                  setLocalSettings({ ...localSettings, partnerLanguage: value })
                                }
                              >
                                <SelectTrigger id="partner-language-full" className="h-8 text-xs">
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
                          </div>
                          <Button size="sm" className="w-full mt-4 text-xs h-8" onClick={saveSettings}>
                            <Check className="h-3 w-3 mr-1" />
                            Save Changes
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-8">
                      {activeConversationData?.messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          currentLanguageSettings={{
                            userLanguage: translationSettings.userLanguage,
                            partnerLanguage: translationSettings.partnerLanguage,
                          }}
                          onTranslate={() =>
                            handleTranslateMessage(
                              activeConversation,
                              message.id,
                              message.text,
                              message.senderId === "me"
                                ? translationSettings.partnerLanguage
                                : translationSettings.userLanguage,
                            )
                          }
                          onToggleTranslation={() => toggleTranslationVisibility(activeConversation, message.id)}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                        disabled={isSending}
                      />
                      <Button
                        size="icon"
                        className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                      >
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="text-muted-foreground mt-1">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChatMessage({ message, currentLanguageSettings, onTranslate, onToggleTranslation }) {
  const isMe = message.senderId === "me"

  // Determine if we need to show the re-translate option
  const showRetranslateOption =
    message.translation &&
    ((isMe && message.translatedTo !== currentLanguageSettings.partnerLanguage) ||
      (!isMe && message.translatedTo !== currentLanguageSettings.userLanguage))

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-8`}>
      <motion.div
        className={`max-w-[80%] ${
          isMe ? "bg-blue-500 text-white rounded-t-lg rounded-bl-lg" : "bg-muted rounded-t-lg rounded-br-lg"
        } p-3 relative`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>

        {message.isTranslating && (
          <div className="mt-1 flex items-center gap-1 text-xs opacity-70">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Translating...</span>
          </div>
        )}

        {message.translation && message.showTranslation && (
          <div className="mt-2 pt-2 border-t border-gray-200/20">
            <p className="text-sm italic opacity-90 break-words whitespace-pre-wrap">{message.translation}</p>
            {message.translatedTo && <p className="text-xs mt-1 opacity-70">Translated to {message.translatedTo}</p>}
          </div>
        )}

        <div className="absolute -bottom-7 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>

          <TooltipProvider>
            {message.translation ? (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-background border border-border/40 hover:bg-background/90"
                      onClick={onToggleTranslation}
                    >
                      <Globe className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {message.showTranslation ? "Hide translation" : "Show translation"}
                  </TooltipContent>
                </Tooltip>

                {showRetranslateOption && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full bg-background border border-border/40 hover:bg-background/90"
                        onClick={onTranslate}
                        disabled={message.isTranslating}
                      >
                        <RefreshCw className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Re-translate with current settings</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full bg-background border border-border/40 hover:bg-background/90"
                    onClick={onTranslate}
                    disabled={message.isTranslating}
                  >
                    {message.isTranslating ? (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : (
                      <Languages className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Translate message</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </motion.div>
    </div>
  )
}
