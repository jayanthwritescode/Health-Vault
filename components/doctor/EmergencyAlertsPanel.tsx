'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  User,
  Activity,
  Heart,
  CheckCircle,
  X,
  MessageSquare,
  Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useEmergencyStore, EmergencyAlert } from '@/lib/emergency-store'

interface EmergencyAlertsPanelProps {
  doctorId?: string
}

export function EmergencyAlertsPanel({ doctorId }: EmergencyAlertsPanelProps) {
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null)
  const [response, setResponse] = useState('')
  const [isResponding, setIsResponding] = useState(false)
  
  const { getActiveAlerts, updateAlertStatus, assignDoctor } = useEmergencyStore()

  useEffect(() => {
    // Load active alerts
    const alerts = getActiveAlerts()
    setActiveAlerts(alerts)
    
    // Auto-refresh alerts every 30 seconds
    const interval = setInterval(() => {
      const updatedAlerts = getActiveAlerts()
      setActiveAlerts(updatedAlerts)
    }, 30000)

    return () => clearInterval(interval)
  }, [getActiveAlerts])

  const handleAcceptAlert = (alert: EmergencyAlert) => {
    if (doctorId) {
      assignDoctor(alert.id, doctorId)
      updateAlertStatus(alert.id, 'acknowledged', 'I am reviewing your case now.')
    }
    setSelectedAlert(alert)
  }

  const handleSendResponse = async () => {
    if (!selectedAlert || !response.trim()) return

    setIsResponding(true)
    
    try {
      // Simulate API call to send response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateAlertStatus(selectedAlert.id, 'acknowledged', response)
      setResponse('')
      
      // Refresh alerts
      setActiveAlerts(getActiveAlerts())
      
    } catch (error) {
      console.error('Failed to send response:', error)
    } finally {
      setIsResponding(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-600 bg-red-50 border-red-200'
    if (severity >= 5) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const getEmergencyTypeColor = (type: EmergencyAlert['emergencyType']) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`
    return `${Math.floor(diffMinutes / 1440)} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Active Alerts Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">Emergency Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {activeAlerts.length === 0 ? 'No active emergencies' : `${activeAlerts.length} active emergency${activeAlerts.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Active Alerts List */}
      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No active emergency alerts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10"
            >
              <Card className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getEmergencyTypeColor(alert.emergencyType)}>
                          {alert.emergencyType.toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(alert.severity)}>
                          Severity: {alert.severity}/10
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{alert.patientName}</span>
                        <span className="text-sm text-muted-foreground">• {alert.patientPhone}</span>
                      </div>

                      <div className="mb-2">
                        <div className="text-sm font-medium mb-1">Symptoms:</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.symptoms.join(', ')}
                        </div>
                      </div>

                      {alert.location && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{alert.location.address}</span>
                        </div>
                      )}

                      {/* Health Summary */}
                      <div className="bg-white/50 rounded-lg p-2 mb-3">
                        <div className="text-xs font-medium mb-1">Health Summary:</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>Overall: {alert.healthSummary.overallHealth}</div>
                          <div>Critical: {alert.healthSummary.criticalReports}</div>
                          <div>Allergies: {alert.healthSummary.allergies.length || 'None'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `tel:${alert.patientPhone}`}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptAlert(alert)}
                        disabled={!!alert.assignedDoctor}
                      >
                        {alert.assignedDoctor ? 'Assigned' : 'Accept'}
                      </Button>
                    </div>
                  </div>

                  {alert.assignedDoctor && (
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      Assigned to: {alert.assignedDoctor}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Alert Detail */}
      {selectedAlert && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Respond to Emergency
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedAlert(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Patient: {selectedAlert.patientName}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  {selectedAlert.symptoms.join(', ')}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Response:</label>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Provide medical guidance or ask for more information..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSendResponse}
                  disabled={!response.trim() || isResponding}
                  className="flex-1"
                >
                  {isResponding ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => window.location.href = `tel:${selectedAlert.patientPhone}`}
                  variant="outline"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
