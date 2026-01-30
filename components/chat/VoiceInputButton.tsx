'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VoiceInputButtonProps {
  isListening: boolean
  isSpeaking: boolean
  isVoiceEnabled: boolean
  onToggleListening: () => void
  onToggleVoice: () => void
  disabled?: boolean
}

export function VoiceInputButton({
  isListening,
  isSpeaking,
  isVoiceEnabled,
  onToggleListening,
  onToggleVoice,
  disabled = false
}: VoiceInputButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleButtonClick = () => {
    if (!isVoiceEnabled) {
      onToggleVoice()
      setTimeout(() => onToggleListening(), 100)
    } else {
      onToggleListening()
    }
  }

  return (
    <div className="relative">
      <Button
        variant={isListening ? 'destructive' : 'outline'}
        size="icon"
        onClick={handleButtonClick}
        disabled={disabled || isSpeaking}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden"
      >
        {/* Voice wave animation when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 bg-destructive/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {isListening ? (
          <MicOff className="w-4 h-4 animate-pulse" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      {/* Tooltip */}
      {isHovered && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-popover-foreground whitespace-nowrap z-10"
        >
          {!isVoiceEnabled 
            ? "Enable voice input" 
            : isListening 
              ? "Stop recording" 
              : "Start voice input"
          }
        </motion.div>
      )}

      {/* Voice enabled indicator */}
      {isVoiceEnabled && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVoice}
          className="absolute -right-10 top-0 w-6 h-6"
        >
          {isSpeaking ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  )
}
