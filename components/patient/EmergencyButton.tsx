'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Loader2,
  CheckCircle,
  X,
  User,
  Activity,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useEmergencyStore, EmergencyAlert } from '@/lib/emergency-store'
import { useReportsStore } from '@/lib/reports-store'

interface EmergencyButtonProps {
  patientInfo: {
    id: string
    name: string
    phone: string
    email: string
  }
  className?: string
}

export function EmergencyButton({ patientInfo, className }: EmergencyButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAlertSent, setIsAlertSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedSeverity, setSelectedSeverity] = useState(5)
  const [symptoms, setSymptoms] = useState('')
  const [location, setLocation] = useState('')
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null)
  
  const { createEmergencyAlert, getAvailableDoctors, assignDoctor } = useEmergencyStore()
  const { healthSummary, getCriticalReports } = useReportsStore()

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation && isExpanded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Reverse geocoding would go here in production
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        },
        (error) => {
          console.error('Location access denied:', error)
        }
      )
    }
  }, [isExpanded])

  const handleEmergencyAlert = async () => {
    if (!symptoms.trim()) {
      alert('Please describe your symptoms before sending the alert.')
      return
    }

    setIsSending(true)

    try {
      // Get emergency summary from reports store
      const emergencyData = {
        patientId: patientInfo.id,
        patientName: patientInfo.name,
        patientPhone: patientInfo.phone,
        patientEmail: patientInfo.email,
        emergencyType: (selectedSeverity >= 8 ? 'critical' : selectedSeverity >= 5 ? 'urgent' : 'moderate') as 'critical' | 'urgent' | 'moderate',
        symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
        severity: selectedSeverity,
        location: location ? {
          latitude: 0, // Would be parsed from location string
          longitude: 0,
          address: location
        } : undefined,
        healthSummary: {
          overallHealth: healthSummary?.overallHealth || 'unknown',
          criticalReports: getCriticalReports().length,
          abnormalReports: healthSummary?.abnormalReports || 0,
          recentMedications: healthSummary?.medications.map(m => m.name) || [],
          allergies: healthSummary?.allergies || [],
          conditions: healthSummary?.conditions || [],
          lastUpdated: healthSummary?.lastUpdated || new Date().toISOString()
        },
        message: `Emergency alert: ${symptoms}`
      }

      const alert = createEmergencyAlert(emergencyData)
      setCurrentAlert(alert)
      setIsAlertSent(true)

      // Auto-assign first available doctor for critical cases
      if (selectedSeverity >= 8) {
        const availableDoctors = getAvailableDoctors()
        if (availableDoctors.length > 0) {
          setTimeout(() => {
            assignDoctor(alert.id, availableDoctors[0].id)
          }, 2000)
        }
      }

    } catch (error) {
      console.error('Failed to send emergency alert:', error)
      alert('Failed to send emergency alert. Please try again or call emergency services directly.')
    } finally {
      setIsSending(false)
    }
  }

  const handleCallEmergency = () => {
    window.location.href = 'tel:108' // Emergency number
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 bg-red-50 border-red-200'
    if (severity >= 5) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return 'Critical'
    if (severity >= 5) return 'Urgent'
    return 'Moderate'
  }

  if (isAlertSent && currentAlert) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={className}
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Emergency Alert Sent!
              </h3>
              
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Your emergency alert has been sent to available doctors.
                {currentAlert.assignedDoctor && (
                  <> Dr. {currentAlert.assignedDoctor} has been assigned to your case.</>
                )}
              </p>

              <div className="space-y-2 text-sm text-left bg-white/50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>Alert ID: {currentAlert.id.slice(-8)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span>Severity: {getSeverityLabel(currentAlert.severity)}</span>
                </div>
                {currentAlert.assignedDoctor && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span>Assigned: {currentAlert.assignedDoctor}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCallEmergency}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Emergency
                </Button>
                <Button 
                  onClick={() => {
                    setIsAlertSent(false)
                    setIsExpanded(false)
                    setCurrentAlert(null)
                    setSymptoms('')
                    setSelectedSeverity(5)
                  }}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Severity Selector */}
                <div>
                  <label className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 block">
                    Severity Level: {getSeverityLabel(selectedSeverity)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(Number(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-red-600 dark:text-red-400 mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                    <span>Critical</span>
                  </div>
                </div>

                {/* Symptoms Input */}
                <div>
                  <label className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 block">
                    Describe Your Symptoms
                  </label>
                  <Textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Chest pain, difficulty breathing, dizziness..."
                    className="min-h-[80px] border-red-200 bg-white/50"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-red-800 dark:text-red-200 mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Getting your location..."
                    className="border-red-200 bg-white/50"
                  />
                </div>

                {/* Health Summary Preview */}
                {healthSummary && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                      Health Summary (will be sent to doctors):
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Overall Health: {healthSummary.overallHealth}</div>
                      <div>Critical Reports: {getCriticalReports().length}</div>
                      <div>Allergies: {healthSummary.allergies.length || 'None'}</div>
                      <div>Conditions: {healthSummary.conditions.length || 'None'}</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleEmergencyAlert}
                    disabled={isSending || !symptoms.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Alert to Doctors
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCallEmergency}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full h-14 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-red-600 hover:bg-red-700 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <X className="w-6 h-6" />
            ) : (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-6 h-6" />
              </motion.div>
            )}
            <span className="font-semibold text-lg">
              {isExpanded ? 'Cancel' : 'Emergency'}
            </span>
            {!isExpanded && (
              <Heart className="w-5 h-5" />
            )}
          </div>
        </Button>
      </motion.div>

      {!isExpanded && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press for immediate medical assistance
        </p>
      )}
    </div>
  )
}
