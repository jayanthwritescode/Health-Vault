'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Languages,
  Download,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useChatStore } from '@/lib/store'
import { useVoiceChat } from '@/lib/use-voice-chat'

export default function PatientHistoryPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help collect some information before your appointment. This will help your doctor provide better care. What brings you in today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState('en')
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<any>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { 
    isListening, 
    isSpeaking, 
    toggleListening, 
    speak, 
    speakFallback,
    stopSpeaking 
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setInput(text)
        handleSend()
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    language: language === 'en' ? 'en-IN' : `${language}-IN`
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          type: 'pre-consultation'
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                assistantMessage += parsed.text
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1].content = assistantMessage
                  return newMessages
                })
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Update progress based on conversation length
      const newProgress = Math.min(100, (messages.length / 20) * 100)
      setProgress(newProgress)

      // Speak the assistant's response if voice is enabled
      if (voiceEnabled && assistantMessage) {
        // Use ElevenLabs for better quality, automatically falls back to browser TTS
        speak(assistantMessage)
      }

      // Check if conversation should end (look for completion phrases)
      if (assistantMessage.toLowerCase().includes('prepare a summary') || 
          assistantMessage.toLowerCase().includes('have everything i need') ||
          assistantMessage.toLowerCase().includes('that completes') ||
          newProgress >= 80) {
        // Generate summary after a brief delay
        setTimeout(() => generateSummary(), 2000)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const generateSummary = async () => {
    setIsGeneratingSummary(true)
    
    try {
      const conversationText = messages
        .map(m => `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`)
        .join('\n\n')

      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: conversationText })
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
        setProgress(100)
      }
    } catch (error) {
      console.error('Summary generation error:', error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const downloadPDF = () => {
    if (!summary) return

    // Create a simple text version for download
    const content = `
PATIENT HISTORY SUMMARY
Generated: ${new Date().toLocaleString()}

CHIEF COMPLAINT:
${summary.chiefComplaint}

PRESENT ILLNESS:
${summary.presentIllness}

MEDICATIONS:
${summary.medications.join('\n')}

ALLERGIES:
${summary.allergies.join('\n')}

PAST MEDICAL HISTORY:
${summary.pastMedicalHistory.join('\n')}

KEY FINDINGS:
${summary.keyFindings.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

URGENCY LEVEL: ${summary.urgencyLevel.toUpperCase()}

DOCTOR'S NOTES:
${summary.doctorNotes}

${summary.redFlags.length > 0 ? `\nRED FLAGS:\n${summary.redFlags.join('\n')}` : ''}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patient-history-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleRecording = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true)
    }
    toggleListening()
  }

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Pre-Consultation History</h1>
                <p className="text-sm text-muted-foreground">
                  Help us understand your health better
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/patient/select-language?mode=history')}>
              <Mic className="w-4 h-4 mr-2" />
              Switch to Voice Mode
            </Button>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-background text-sm"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Summary Card */}
      {summary && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <CardTitle>History Collection Complete!</CardTitle>
                  </div>
                  <Button onClick={downloadPDF} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Summary
                  </Button>
                </div>
                <CardDescription>
                  Your information has been recorded. Your doctor will review this before your appointment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Chief Complaint</h4>
                  <p className="text-sm text-muted-foreground">{summary.chiefComplaint}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Key Findings</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {summary.keyFindings.map((finding: string, idx: number) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>

                {summary.redFlags.length > 0 && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      ⚠️ Important Notes
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                      {summary.redFlags.map((flag: string, idx: number) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Badge variant={summary.urgencyLevel === 'emergency' ? 'destructive' : 'default'}>
                    {summary.urgencyLevel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {summary.medications.length} medication(s) • {summary.allergies.length} allergy/allergies
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-32">
          {messages.map((message, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'glass border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass border rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            </motion.div>
          )}

          {isGeneratingSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="glass border rounded-2xl px-6 py-4 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                <span className="text-sm font-medium">Generating summary...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!summary && (
        <div className="fixed bottom-0 left-0 right-0 glass border-t">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-end gap-2">
            <Button
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              onClick={toggleRecording}
              className="shrink-0"
              disabled={isSpeaking}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Your information is secure and will only be shared with your doctor</span>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
