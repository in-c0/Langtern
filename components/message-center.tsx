"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Search, Send } from "lucide-react"

export function MessageCenter() {
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")

  // Sample data - would come from API in real implementation
  const conversations = [
    {
      id: 1,
      contact: {
        id: 101,
        name: "GreenLeaf Marketing",
        avatar: "G",
      },
      lastMessage: {
        text: "Thanks for your application! We'd like to schedule an interview.",
        timestamp: "10:30 AM",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: 2,
      contact: {
        id: 102,
        name: "Tech Innovators",
        avatar: "T",
      },
      lastMessage: {
        text: "How's your progress on the project?",
        timestamp: "Yesterday",
        isRead: false,
      },
      unreadCount: 2,
    },
    {
      id: 3,
      contact: {
        id: 103,
        name: "Global Solutions",
        avatar: "G",
      },
      lastMessage: {
        text: "We've reviewed your application and would like to discuss next steps.",
        timestamp: "May 10",
        isRead: true,
      },
      unreadCount: 0,
    },
  ]

  const messages = {
    1: [
      {
        id: 1,
        senderId: 101,
        text: "Hello! Thanks for your interest in our internship opportunity.",
        timestamp: "May 12, 10:15 AM",
      },
      {
        id: 2,
        senderId: "me",
        text: "Hi! Yes, I'm very interested in the digital marketing position.",
        timestamp: "May 12, 10:20 AM",
      },
      {
        id: 3,
        senderId: 101,
        text: "Great! We've reviewed your profile and would like to schedule an interview.",
        timestamp: "May 12, 10:25 AM",
      },
      {
        id: 4,
        senderId: 101,
        text: "Thanks for your application! We'd like to schedule an interview.",
        timestamp: "May 12, 10:30 AM",
      },
    ],
    2: [
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
    3: [
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
  }

  const filteredConversations = conversations.filter((convo) =>
    convo.contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return

    // In a real app, this would send the message to an API
    console.log("Sending message:", messageText, "to conversation:", activeConversation)

    // Clear the input
    setMessageText("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

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
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {conversation.contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{conversation.contact.name}</p>
                              <span className="text-xs text-muted-foreground">
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
                            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
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
            <div className="col-span-2 flex flex-col h-full">
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-border flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {conversations.find((c) => c.id === activeConversation)?.contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">
                        {conversations.find((c) => c.id === activeConversation)?.contact.name}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages[activeConversation]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p>{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                      />
                      <Button size="icon" className="ml-2" onClick={handleSendMessage} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4" />
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
