'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface VoiceWaveformProps {
  isActive: boolean
  color?: string
}

export function VoiceWaveform({ isActive, color = '#8b5cf6' }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bars = 40
    const barWidth = canvas.width / bars
    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < bars; i++) {
        const height = isActive
          ? Math.sin(phase + i * 0.5) * 20 + 25 + Math.random() * 10
          : 5
        
        const x = i * barWidth
        const y = (canvas.height - height) / 2
        
        ctx.fillStyle = color
        ctx.fillRect(x, y, barWidth - 2, height)
      }
      
      phase += 0.1
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, color])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full h-full"
    />
  )
}

export function ListeningIndicator({ isListening }: { isListening: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-purple-600 rounded-full"
            animate={isListening ? {
              height: [10, 25, 10],
              opacity: [0.5, 1, 0.5]
            } : {
              height: 10,
              opacity: 0.3
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      {isListening && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-purple-600 font-medium"
        >
          Listening...
        </motion.span>
      )}
    </div>
  )
}

export function SpeakingIndicator({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="flex gap-1"
        animate={isSpeaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-4 bg-blue-600 rounded-full"
            animate={isSpeaking ? {
              scaleY: [1, 1.5, 0.8, 1.5, 1],
              opacity: [0.7, 1, 0.7, 1, 0.7]
            } : {
              scaleY: 1,
              opacity: 0.3
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
      {isSpeaking && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-blue-600 font-medium"
        >
          Speaking...
        </motion.span>
      )}
    </div>
  )
}
