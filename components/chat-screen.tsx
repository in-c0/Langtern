"use client"

import { UnifiedMessageCenter } from "@/components/unified-message-center"

interface ChatScreenProps {
  onProceed?: () => void
}

export function ChatScreen({ onProceed }: ChatScreenProps) {
  return (
    <div className="w-full">
      <UnifiedMessageCenter mode="flow" initialConversationId={1} onProceed={onProceed} />
    </div>
  )
}
