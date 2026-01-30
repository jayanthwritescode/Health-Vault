'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from './ChatMessage'
import { TypingIndicator } from './TypingIndicator'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  emotion?: 'neutral' | 'concerned' | 'empathetic' | 'urgent'
}

interface MessageListProps {
  messages: Message[]
  isTyping?: boolean
  typingMessage?: string
  autoScroll?: boolean
}

export function MessageList({ 
  messages, 
  isTyping = false, 
  typingMessage = "AI is thinking...",
  autoScroll = true 
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom()
    }
  }, [messages, isTyping, autoScroll])

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <ChatMessage 
            key={`${message.role}-${index}-${message.timestamp?.getTime() || Date.now()}`}
            message={message}
          />
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypingIndicator 
              isVisible={true} 
              message={typingMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  )
}
