'use client'

import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

interface TypingIndicatorProps {
  isVisible: boolean
  message?: string
}

export function TypingIndicator({ isVisible, message = "AI is thinking..." }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="flex gap-3 max-w-[85%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4" />
        </div>

        {/* Typing Content */}
        <div className="bg-card border border-border rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-sm text-muted-foreground">{message}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
