"use client"

import { UnifiedMessageCenter } from "@/components/unified-message-center"

interface ChatScreenProps {
  match?: {
    name: string
    profileId: string
  }
  onProceed?: () => void
}

export function ChatScreen({ match, onProceed }: ChatScreenProps) {
  return (
    <div className="w-full">
      <UnifiedMessageCenter
        recipientName={match?.name || "Chat Partner"}
        recipientId={match?.profileId}
        mode="flow"
        initialConversationId={1}
        onProceed={onProceed}
      />
    </div>
  )
}
