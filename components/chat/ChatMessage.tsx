'use client'

import { motion } from 'framer-motion'
import { User, Bot, AlertCircle } from 'lucide-react'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp?: Date
    emotion?: 'neutral' | 'concerned' | 'empathetic' | 'urgent'
  }
  isTyping?: boolean
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
      >
        <div className="bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-accent text-accent-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-accent text-white'
            : 'bg-card border border-border'
        }`}>
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
