'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mic, ArrowRight, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SelectLanguagePage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [mode, setMode] = useState<'history' | 'assistant'>('history')

  const languages = [
    { code: 'en-IN', name: 'English', nativeName: 'English', description: 'Speak in English' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', description: 'हिंदी में बोलें' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', description: 'தமிழில் பேசுங்கள்' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', description: 'తెలుగులో మాట్లాడండి' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', description: 'বাংলায় কথা বলুন' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', description: 'मराठीत बोला' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', description: 'ગુજરાતીમાં બોલો' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', description: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' }
  ]

  const handleContinue = () => {
    if (!selectedLanguage) return
    
    const targetPage = mode === 'history' 
      ? `/patient/history-voice?lang=${selectedLanguage}`
      : `/patient/assistant-voice?lang=${selectedLanguage}`
    
    router.push(targetPage)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-base font-bold tracking-tight">Voice Mode</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">Select language</div>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Choose your language
            </h1>
            <p className="text-lg text-muted-foreground">
              Select the language you're most comfortable speaking in for voice conversations
            </p>
          </div>

          {/* Mode Selection */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              What would you like to do?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('history')}
                className={`p-6 rounded-lg border-2 text-left transition-smooth ${
                  mode === 'history'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  {mode === 'history' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold mb-1">Patient History Collection</h3>
                <p className="text-sm text-muted-foreground">
                  Share your medical history before a doctor's appointment
                </p>
              </button>

              <button
                onClick={() => setMode('assistant')}
                className={`p-6 rounded-lg border-2 text-left transition-smooth ${
                  mode === 'assistant'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>
                  {mode === 'assistant' && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold mb-1">Health Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Ask health questions and get instant AI-powered guidance
                </p>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Select your preferred language
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {languages.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-lg border-2 text-left transition-smooth ${
                    selectedLanguage === lang.code
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg font-bold mb-0.5">{lang.nativeName}</div>
                      <div className="text-sm text-muted-foreground">{lang.description}</div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedLanguage}
              className="bg-accent hover:bg-accent/90 text-white h-12 px-8 text-base font-medium shadow-elevated"
            >
              Continue to Voice Mode
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
            </Button>
          </div>

          {/* Info Section */}
          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Voice Mode Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>Speak naturally in your selected language with real-time speech recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>AI understands context and responds in the same language with natural voice</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>Switch languages anytime during your conversation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>Automatic transcription and documentation of your conversation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
