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
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  Languages,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useVoiceChat } from '@/lib/use-voice-chat'
import { VoiceWaveform, ListeningIndicator, SpeakingIndicator } from '@/components/voice-waveform'

function PatientAssistantVoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const langParam = searchParams.get('lang') || 'en-IN'
  
  const greetings: Record<string, string> = {
    'en-IN': "Hello! I'm your digital health assistant. I can help you with explaining medical reports, scheduling appointments, medication reminders, symptom checking, and health information. How can I assist you today?",
    'hi-IN': 'नमस्ते! मैं आपका डिजिटल स्वास्थ्य सहायक हूं। मैं मेडिकल रिपोर्ट समझाने, अपॉइंटमेंट शेड्यूल करने, दवा रिमाइंडर, लक्षण जांच और स्वास्थ्य जानकारी में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'ta-IN': 'வணக்கம்! நான் உங்கள் டிஜிட்டல் சுகாதார உதவியாளர். மருத்துவ அறிக்கைகளை விளக்குதல், சந்திப்புகளை திட்டமிடுதல், மருந்து நினைவூட்டல்கள், அறிகுறி சோதனை மற்றும் சுகாதார தகவல்களில் நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    'te-IN': 'నమస్కారం! నేను మీ డిజిటల్ ఆరోగ్య సహాయకుడిని. వైద్య నివేదికలను వివరించడం, అపాయింట్‌మెంట్‌లు షెడ్యూల్ చేయడం, మందుల రిమైండర్‌లు, లక్షణ తనిఖీ మరియు ఆరోగ్య సమాచారంలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    'bn-IN': 'নমস্কার! আমি আপনার ডিজিটাল স্বাস্থ্য সহায়ক। আমি মেডিকেল রিপোর্ট ব্যাখ্যা করা, অ্যাপয়েন্টমেন্ট শিডিউল করা, ওষুধের অনুস্মারক, লক্ষণ পরীক্ষা এবং স্বাস্থ্য তথ্যে আপনাকে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
    'mr-IN': 'नमस्कार! मी तुमचा डिजिटल आरोग्य सहाय्यक आहे। मी वैद्यकीय अहवाल समजावून सांगणे, भेटी शेड्यूल करणे, औषध स्मरणपत्रे, लक्षण तपासणी आणि आरोग्य माहितीमध्ये तुम्हाला मदत करू शकतो। आज मी तुम्हाला कशी मदत करू शकतो?',
    'gu-IN': 'નમસ્તે! હું તમારો ડિજિટલ આરોગ્ય સહાયક છું. હું તબીબી અહેવાલો સમજાવવા, મુલાકાતો શેડ્યૂલ કરવા, દવા રીમાઇન્ડર્સ, લક્ષણ તપાસ અને આરોગ્ય માહિતીમાં તમને મદદ કરી શકું છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
    'kn-IN': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ಸಹಾಯಕ. ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ವಿವರಿಸುವುದು, ಭೇಟಿಗಳನ್ನು ನಿಗದಿಪಡಿಸುವುದು, ಔಷಧಿ ಜ್ಞಾಪನೆಗಳು, ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲನೆ ಮತ್ತು ಆರೋಗ್ಯ ಮಾಹಿತಿಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
  }
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: greetings[langParam] || greetings['en-IN']
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState(langParam)
  const [voiceStatus, setVoiceStatus] = useState<string>('')
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
      setVoiceStatus(`Voice error: ${error}`)
      setTimeout(() => setVoiceStatus(''), 3000)
    },
    language: language === 'en' ? 'en-IN' : `${language}-IN`
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

  const handleVoiceInput = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }],
          type: 'patient-assistant'
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

      if (assistantMessage && !isMuted) {
        speak(assistantMessage)
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
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopSpeaking()
    }
  }

  const features = [
    { icon: Calendar, label: 'Appointments', color: 'text-primary' },
    { icon: FileText, label: 'Reports', color: 'text-secondary' },
    { icon: Pill, label: 'Medications', color: 'text-accent' }
  ]

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
                onClick={() => router.push('/patient/assistant')}
                className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight">Voice Assistant</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Speak naturally</div>
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
                onClick={() => router.push('/patient/assistant')}
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

      {/* Voice Status Indicator */}
      {voiceStatus && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
            {voiceStatus}
          </div>
        </div>
      )}

      <div className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Voice features not supported</span>
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Please use Chrome, Edge, or Safari browser for voice features. You can still use text mode.
              </p>
              <button
                onClick={() => router.push('/patient/assistant')}
                className="mt-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
              >
                Switch to Text Mode
              </button>
            </div>
          )}

          {/* Quick Actions - Only show initially */}
          {messages.length === 1 && isSupported && (
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-3">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card border border-border rounded-lg p-4 text-center shadow-clinical"
                  >
                    <feature.icon className={`w-6 h-6 mx-auto mb-2 ${feature.color}`} strokeWidth={1.5} />
                    <p className="text-xs font-medium text-muted-foreground">{feature.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Interface */}
          <div className="mb-8 bg-card border border-border rounded-lg p-8 shadow-clinical">
            <div className="flex flex-col items-center gap-6">
              {/* Waveform */}
              <div className="w-full h-20 bg-primary/5 rounded-lg overflow-hidden">
                <VoiceWaveform isActive={isListening || isSpeaking} color="hsl(var(--primary))" />
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
                    className="w-full p-4 bg-primary/5 rounded-lg border border-primary/10"
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
                    : 'bg-accent text-white hover:bg-accent/90'
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
                  ? "Listening... Ask me anything about your health"
                  : isSpeaking
                  ? "Speaking... Please wait"
                  : isLoading
                  ? "Processing your request..."
                  : "Tap the microphone and speak naturally"}
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
                      ? 'bg-accent text-white'
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
                  <Loader2 className="w-5 h-5 animate-spin text-primary" strokeWidth={1.5} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PatientAssistantVoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading voice assistant...</p>
        </div>
      </div>
    }>
      <PatientAssistantVoiceContent />
    </Suspense>
  )
}
