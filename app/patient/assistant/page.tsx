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
  FileText,
  Calendar,
  Pill,
  Activity,
  HelpCircle,
  Clock,
  CheckCircle,
  Stethoscope,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppointmentStore } from '@/lib/appointments-store'
import { useVoiceChat } from '@/lib/use-voice-chat'

export default function PatientAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hello! I'm your health assistant. I can help you with:\n\n• Understanding medical reports\n• Scheduling appointments\n• Medication information\n• Symptom guidance\n• General health questions\n\nWhat would you like help with today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [schedulerData, setSchedulerData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    specialty: 'General Physician',
    date: '',
    time: '',
    type: 'in-person' as 'in-person' | 'video' | 'phone',
    reason: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addAppointment, getUpcomingAppointments } = useAppointmentStore()
  const myAppointments = getUpcomingAppointments()

  const { 
    isListening, 
    isSpeaking, 
    toggleListening, 
    speak
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setInput(text)
        setTimeout(() => handleSend(), 100)
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
    language: 'en-IN'
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const features = [
    {
      id: 'report',
      icon: FileText,
      title: 'Explain Reports',
      description: 'Understand medical reports'
    },
    {
      id: 'appointment',
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Schedule a consultation'
    },
    {
      id: 'medication',
      icon: Pill,
      title: 'Medications',
      description: 'Reminders & interactions'
    },
    {
      id: 'symptom',
      icon: Activity,
      title: 'Symptoms',
      description: 'Understand your symptoms'
    }
  ]

  const handleFeatureClick = (featureId: string) => {
    if (featureId === 'appointment') {
      setShowScheduler(true)
    } else if (featureId === 'report') {
      // Trigger file upload for reports
      document.getElementById('file-upload')?.click()
    } else {
      const feature = features.find(f => f.id === featureId)
      if (feature) {
        setInput(`I need help with: ${feature.title}`)
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      
      // Add message about file upload
      setMessages(prev => [...prev, {
        role: 'user',
        content: `I've uploaded a medical report: ${file.name}`
      }])
      
      setIsLoading(true)
      
      try {
        // Here you would typically send the file to an OCR service or API
        // For now, we'll simulate the response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I can see you've uploaded "${file.name}". To help you understand this report, could you tell me:

1. What type of report is this? (blood test, X-ray, etc.)
2. Do you have specific concerns about any values?
3. When was this test done?

Once you provide this information, I can help explain the findings in simple terms. Remember, I'm here to help you understand, not to provide medical diagnosis.`
          }])
          setIsLoading(false)
        }, 2000)
      } catch (error) {
        console.error('File upload error:', error)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I had trouble processing that file. Please try again or describe the report contents.'
        }])
        setIsLoading(false)
      }
    }
  }

  const handleScheduleAppointment = () => {
    if (!schedulerData.patientName || !schedulerData.date || !schedulerData.time || !schedulerData.reason) {
      alert('Please fill in all required fields')
      return
    }

    addAppointment({
      patientName: schedulerData.patientName,
      patientEmail: schedulerData.patientEmail,
      patientPhone: schedulerData.patientPhone,
      doctorName: 'Dr. Anjali Mehta',
      specialty: schedulerData.specialty,
      date: schedulerData.date,
      time: schedulerData.time,
      duration: 30,
      type: schedulerData.type,
      status: 'scheduled',
      reason: schedulerData.reason,
    })

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: `Appointment confirmed!\n\nDoctor: Dr. Anjali Mehta (${schedulerData.specialty})\nDate: ${new Date(schedulerData.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nTime: ${schedulerData.time}\nType: ${schedulerData.type === 'in-person' ? 'In-person visit' : schedulerData.type === 'video' ? 'Video consultation' : 'Phone consultation'}\n\nYou'll receive a confirmation email shortly.`
      }
    ])

    setShowScheduler(false)
    setSchedulerData({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      specialty: 'General Physician',
      date: '',
      time: '',
      type: 'in-person',
      reason: ''
    })
  }

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
                  // Speak the assistant's response if voice is enabled
                  if (voiceEnabled && assistantMessage) {
                    speak(assistantMessage)
                  }
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

      if (assistantMessage) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
                  <div className="text-base font-bold tracking-tight">Health Assistant</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">AI-powered support</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/patient/dashboard')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth hidden sm:block"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/patient/select-language?mode=assistant')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth hidden sm:block"
              >
                Voice Mode
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Appointment Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-prominent"
          >
            <div className="p-6">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold mb-2">Schedule Appointment</h2>
                <p className="text-sm text-muted-foreground">Book a consultation with a healthcare professional</p>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name *</label>
                    <Input
                      placeholder="Rajesh Kumar"
                      value={schedulerData.patientName}
                      onChange={(e) => setSchedulerData({...schedulerData, patientName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="rajesh.kumar@email.com"
                      value={schedulerData.patientEmail}
                      onChange={(e) => setSchedulerData({...schedulerData, patientEmail: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone Number</label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={schedulerData.patientPhone}
                      onChange={(e) => setSchedulerData({...schedulerData, patientPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Specialty *</label>
                    <select
                      value={schedulerData.specialty}
                      onChange={(e) => setSchedulerData({...schedulerData, specialty: e.target.value})}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option>General Physician</option>
                      <option>Cardiologist</option>
                      <option>Dermatologist</option>
                      <option>Pediatrician</option>
                      <option>Orthopedic</option>
                      <option>ENT Specialist</option>
                      <option>Gynecologist</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Date *</label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={schedulerData.date}
                      onChange={(e) => setSchedulerData({...schedulerData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Time *</label>
                    <Input
                      type="time"
                      value={schedulerData.time}
                      onChange={(e) => setSchedulerData({...schedulerData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Consultation Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'in-person', label: 'In-person', icon: '🏥' },
                      { type: 'video', label: 'Video Call', icon: '📹' },
                      { type: 'phone', label: 'Phone Call', icon: '📞' }
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setSchedulerData({...schedulerData, type: option.type as any})}
                        className={`p-4 rounded-lg border text-center transition-smooth ${
                          schedulerData.type === option.type
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Reason for Visit *</label>
                  <Textarea
                    placeholder="Please describe your symptoms or reason for consultation..."
                    value={schedulerData.reason}
                    onChange={(e) => setSchedulerData({...schedulerData, reason: e.target.value})}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleScheduleAppointment}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" strokeWidth={2} />
                    Confirm Appointment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowScheduler(false)}
                    className="border-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="pt-20 pb-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Upcoming Appointments */}
          {myAppointments.length > 0 && messages.length === 1 && (
            <div className="mb-8">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">Your Upcoming Appointments</h3>
                    <div className="space-y-2">
                      {myAppointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 bg-background rounded-md text-sm"
                        >
                          <div>
                            <p className="font-medium">{apt.doctorName} • {apt.specialty}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(apt.date).toLocaleDateString('en-IN')} at {apt.time}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Cards - Only on first message */}
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {features.map((feature, idx) => (
                  <motion.button
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <feature.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                    <div className="text-sm font-medium text-left">{feature.title}</div>
                    <div className="text-xs text-muted-foreground text-left mt-1">{feature.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden file upload input */}
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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

      {/* Input Area - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-end gap-3">
            <button
              onClick={toggleListening}
              disabled={isSpeaking}
              className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-smooth ${
                isListening 
                  ? 'bg-destructive text-destructive-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 animate-pulse" strokeWidth={2} />
              ) : (
                <Mic className="w-4 h-4" strokeWidth={2} />
              )}
            </button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your health..."
              className="min-h-[44px] max-h-[120px] resize-none"
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-md bg-accent text-white flex items-center justify-center flex-shrink-0 hover:bg-accent/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
              ) : (
                <Send className="w-4 h-4" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
