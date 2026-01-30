'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  MessageSquare,
  Stethoscope,
  CheckCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useVoiceChat } from '@/lib/use-voice-chat'
import { VoiceWaveform, ListeningIndicator, SpeakingIndicator } from '@/components/voice-waveform'

function PatientHistoryVoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang') || 'en-IN'
  
  const greetings: Record<string, string> = {
    'en-IN': "Hello! I'm here to help collect some information before your appointment. This will help your doctor provide better care. What brings you in today?",
    'hi-IN': 'नमस्ते! मैं आपकी अपॉइंटमेंट से पहले कुछ जानकारी एकत्र करने में मदद करने के लिए यहां हूं। यह आपके डॉक्टर को बेहतर देखभाल प्रदान करने में मदद करेगा। आज आप क्यों आए हैं?',
    'ta-IN': 'வணக்கம்! உங்கள் சந்திப்புக்கு முன் சில தகவல்களை சேகரிக்க நான் இங்கு உதவ வந்துள்ளேன். இது உங்கள் மருத்துவருக்கு சிறந்த சிகிச்சை அளிக்க உதவும். இன்று உங்களுக்கு என்ன பிரச்சனை?',
    'te-IN': 'నమస్కారం! మీ అపాయింట్మెంట్ ముందు కొంత సమాచారం సేకరించడానికి నేను ఇక్కడ సహాయం చేయడానికి వచ్చాను. ఇది మీ డాక్టర్‌కు మెరుగైన సంరక్షణ అందించడంలో సహాయపడుతుంది. ఈరోజు మీకు ఏమి సమస్య?',
    'bn-IN': 'নমস্কার! আপনার অ্যাপয়েন্টমেন্টের আগে কিছু তথ্য সংগ্রহ করতে আমি এখানে সাহায্য করতে এসেছি। এটি আপনার ডাক্তারকে আরও ভাল যত্ন প্রদান করতে সাহায্য করবে। আজ আপনার কী সমস্যা?',
    'mr-IN': 'नमस्कार! तुमच्या भेटीपूर्वी काही माहिती गोळा करण्यात मदत करण्यासाठी मी येथे आहे. यामुळे तुमच्या डॉक्टरांना चांगली काळजी घेण्यास मदत होईल. आज तुम्हाला काय समस्या आहे?',
    'gu-IN': 'નમસ્તે! તમારી મુલાકાત પહેલાં કેટલીક માહિતી એકત્રિત કરવામાં મદદ કરવા હું અહીં છું. આ તમારા ડૉક્ટરને વધુ સારી સંભાળ પૂરી પાડવામાં મદદ કરશે. આજે તમને શું સમસ્યા છે?',
    'kn-IN': 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಭೇಟಿಯ ಮೊದಲು ಕೆಲವು ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸಲು ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಇದು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ಉತ್ತಮ ಆರೈಕೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇಂದು ನಿಮಗೆ ಏನು ಸಮಸ್ಯೆ?'
  }
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: greetings[langParam] || greetings['en-IN']
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState(langParam)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { 
    isListening, 
    isSpeaking, 
    isSupported,
    toggleListening, 
    speak, 
    stopSpeaking 
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      setCurrentTranscript(text)
      if (isFinal && text.trim()) {
        handleVoiceInput(text.trim())
        setCurrentTranscript('')
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    language: language
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messages.length === 1 && !isMuted) {
      setTimeout(() => {
        speak(messages[0].content)
      }, 1000)
    }
  }, [])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      stopSpeaking()
    }
  }, [stopSpeaking])

  const handleVoiceInput = async (userMessage: string) => {
    if (isLoading) return

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          type: 'patient-history'
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
            } catch (e) {}
          }
        }
      }

      const newProgress = Math.min(100, (messages.length / 20) * 100)
      setProgress(newProgress)

      if (isListening) {
        toggleListening()
      }

      if (!isMuted && assistantMessage) {
        await new Promise(resolve => setTimeout(resolve, 500))
        await speak(assistantMessage)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (!isListening && !isMuted) {
          toggleListening()
        }
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

  const toggleMute = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    setIsMuted(!isMuted)
  }

  const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी' },
    { code: 'ta-IN', name: 'தமிழ்' },
    { code: 'te-IN', name: 'తెలుగు' },
    { code: 'bn-IN', name: 'বাংলা' },
    { code: 'mr-IN', name: 'मराठी' },
    { code: 'gu-IN', name: 'ગુજરાતી' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/patient/history')}
                className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-clinical">
                  <Stethoscope className="w-5 h-5 text-secondary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight">Patient History</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Pre-consultation</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-9 px-3 rounded-md border border-border bg-background text-sm hidden md:block"
                disabled={isListening || isSpeaking}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <button
                onClick={() => router.push('/patient/history')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth hidden sm:block"
              >
                Text Mode
              </button>
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              >
                {isMuted ? <VolumeX className="w-4 h-4" strokeWidth={1.5} /> : <Volume2 className="w-4 h-4" strokeWidth={1.5} />}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Collection Progress</span>
                <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          )}

          {/* Voice Interface */}
          <div className="mb-8 bg-card border border-border rounded-lg p-8 shadow-clinical">
            <div className="flex flex-col items-center gap-6">
              {/* Waveform */}
              <div className="w-full h-20 bg-secondary/5 rounded-lg overflow-hidden">
                <VoiceWaveform isActive={isListening || isSpeaking} color="hsl(var(--secondary))" />
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-8">
                <ListeningIndicator isListening={isListening} />
                <SpeakingIndicator isSpeaking={isSpeaking} />
              </div>

              {/* Current Transcript */}
              <AnimatePresence>
                {currentTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full p-4 bg-secondary/5 rounded-lg border border-secondary/10"
                  >
                    <p className="text-xs text-muted-foreground mb-1">You're saying:</p>
                    <p className="text-base">{currentTranscript}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Microphone Button */}
              <button
                onClick={toggleListening}
                disabled={!isSupported || isLoading || isSpeaking}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-elevated ${
                  isListening 
                    ? 'bg-destructive text-destructive-foreground scale-110' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12 animate-pulse" strokeWidth={2} />
                ) : (
                  <Mic className="w-12 h-12" strokeWidth={2} />
                )}
              </button>

              <p className="text-sm text-muted-foreground text-center max-w-md">
                {isListening 
                  ? "Listening... Tell me about your health concerns"
                  : isSpeaking
                  ? "Speaking... Please wait"
                  : isLoading
                  ? "Processing your information..."
                  : "Tap the microphone to share your medical history"}
              </p>
            </div>
          </div>

          {/* Conversation History */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Conversation</h3>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-card border border-border shadow-clinical'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-comfortable">{message.content}</p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-clinical">
                  <Loader2 className="w-5 h-5 animate-spin text-secondary" strokeWidth={1.5} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Completion Message */}
          {progress >= 80 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-6"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h4 className="font-semibold mb-1">History Collection Complete</h4>
                  <p className="text-sm text-muted-foreground">
                    Thank you for sharing your information. Your doctor will review this before your appointment.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PatientHistoryVoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading voice interface...</p>
        </div>
      </div>
    }>
      <PatientHistoryVoiceContent />
    </Suspense>
  )
}
