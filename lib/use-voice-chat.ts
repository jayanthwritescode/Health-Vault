import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVoiceChatOptions {
  onTranscript?: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
  language?: string
  autoSpeak?: boolean
}

export const useVoiceChat = ({
  onTranscript,
  onError,
  language = 'en-IN',
  autoSpeak = true
}: UseVoiceChatOptions = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setVoicesLoaded(true)
      }
    }

    // Load voices immediately
    loadVoices()

    // Some browsers need this event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        console.log('Speech recognition started')
      }

      recognition.onresult = (event: any) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcriptPart + ' '
          } else {
            interim += transcriptPart
          }
        }

        if (interim) {
          setInterimTranscript(interim)
          onTranscript?.(interim, false)
        }

        if (final) {
          setTranscript(prev => prev + final)
          setInterimTranscript('')
          onTranscript?.(final.trim(), true)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        // Handle specific error cases
        switch (event.error) {
          case 'not-allowed':
            onError?.('Microphone access denied. Please allow microphone access.')
            break
          case 'no-speech':
            onError?.('No speech detected. Please try again.')
            break
          case 'network':
            onError?.('Network error. Please check your connection.')
            break
          case 'service-not-allowed':
            onError?.('Speech recognition service not allowed. Please try a different browser.')
            break
          default:
            onError?.(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        console.log('Speech recognition ended')
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, onTranscript, onError])

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current && language) {
      recognitionRef.current.lang = language
    }
  }, [language])

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.('Speech recognition is not supported in this browser')
      return
    }

    try {
      // Reset transcript before starting
      setTranscript('')
      setInterimTranscript('')
      
      // Create new recognition instance with current language
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = language
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          setIsListening(true)
          console.log('Speech recognition started')
        }

        recognition.onresult = (event: any) => {
          let interim = ''
          let final = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += transcriptPart + ' '
            } else {
              interim += transcriptPart
            }
          }

          if (interim) {
            setInterimTranscript(interim)
            onTranscript?.(interim, false)
          }

          if (final) {
            setTranscript(prev => prev + final)
            setInterimTranscript('')
            onTranscript?.(final.trim(), true)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          
          switch (event.error) {
            case 'not-allowed':
              onError?.('Microphone access denied. Please allow microphone access.')
              break
            case 'no-speech':
              onError?.('No speech detected. Please try again.')
              break
            case 'network':
              onError?.('Network error. Please check your connection.')
              break
            case 'service-not-allowed':
              onError?.('Speech recognition service not allowed. Please try a different browser.')
              break
            default:
              onError?.(`Speech recognition error: ${event.error}`)
          }
        }

        recognition.onend = () => {
          setIsListening(false)
          console.log('Speech recognition ended')
        }

        recognitionRef.current = recognition
        recognition.start()
      }
    } catch (error) {
      console.error('Error starting recognition:', error)
      onError?.('Failed to start speech recognition')
    }
  }, [isSupported, onError, language, onTranscript])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  // Browser Speech Synthesis (Web Speech API) with multilingual support
  const speakFallback = useCallback((text: string): Promise<void> => {
    if (!text) return Promise.resolve()

    return new Promise((resolve) => {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel()

      // Wait a bit for voices to load if needed
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language
        utterance.rate = 0.95  // Slightly faster for better UX
        utterance.pitch = 1.0
        utterance.volume = 1.0

        // Smart voice selection for better quality
        const voices = window.speechSynthesis.getVoices()
        const langCode = language.split('-')[0] // e.g., 'en', 'hi', 'ta'
        
        if (voices.length > 0) {
          // Priority order for voice selection
          const preferredVoice = 
            // 1. Try exact language match with quality indicators
            voices.find(voice => 
              voice.lang === language && 
              (voice.name.includes('Google') || voice.name.includes('Enhanced') || 
               voice.name.includes('Premium') || voice.name.includes('Natural'))
            ) ||
            // 2. Try language code match with quality indicators
            voices.find(voice => 
              voice.lang.startsWith(langCode) && 
              (voice.name.includes('Google') || voice.name.includes('Enhanced') || 
               voice.name.includes('Premium') || voice.name.includes('Natural'))
            ) ||
            // 3. Try exact language match
            voices.find(voice => voice.lang === language) ||
            // 4. Try language code match
            voices.find(voice => voice.lang.startsWith(langCode)) ||
            // 5. Fallback to first available voice
            voices[0]
          
          if (preferredVoice) {
            utterance.voice = preferredVoice
            console.log(`Using voice: ${preferredVoice.name} (${preferredVoice.lang})`)
          }
        } else {
          console.warn('No voices available yet')
        }

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
          setIsSpeaking(false)
          resolve()
        }
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event)
          setIsSpeaking(false)
          onError?.('Speech synthesis failed')
          resolve()
        }

        window.speechSynthesis.speak(utterance)
      }

      // If voices aren't loaded yet, wait a bit
      if (!voicesLoaded) {
        setTimeout(speakWithVoice, 100)
      } else {
        speakWithVoice()
      }
    })
  }, [language, onError, voicesLoaded])

  // Browser Text-to-Speech (using native Web Speech API)
  const speak = useCallback(async (text: string, voiceId?: string): Promise<void> => {
    if (!text) return Promise.resolve()

    // Use browser TTS directly
    return speakFallback(text)
  }, [speakFallback])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    isSpeaking,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    speakFallback,
    stopSpeaking
  }
}
