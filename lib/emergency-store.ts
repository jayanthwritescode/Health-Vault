import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EmergencyAlert {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  patientEmail: string
  emergencyType: 'critical' | 'urgent' | 'moderate'
  symptoms: string[]
  severity: number // 1-10 scale
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  healthSummary: {
    overallHealth: string
    criticalReports: number
    abnormalReports: number
    recentMedications: string[]
    allergies: string[]
    conditions: string[]
    lastUpdated: string
  }
  message: string
  timestamp: string
  status: 'active' | 'acknowledged' | 'resolved' | 'cancelled'
  assignedDoctor?: string
  doctorResponse?: string
  responseTime?: string
  resolvedAt?: string
}

export interface DoctorContact {
  id: string
  name: string
  specialty: string
  phone: string
  email: string
  isAvailable: boolean
  isOnCall: boolean
  hospital: string
  responseTime: number // average response time in minutes
}

interface EmergencyStore {
  alerts: EmergencyAlert[]
  doctors: DoctorContact[]
  currentAlert: EmergencyAlert | null
  
  // Alert management
  createEmergencyAlert: (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => EmergencyAlert
  updateAlertStatus: (alertId: string, status: EmergencyAlert['status'], response?: string) => void
  getActiveAlerts: () => EmergencyAlert[]
  getAlertById: (alertId: string) => EmergencyAlert | undefined
  
  // Doctor management
  getAvailableDoctors: () => DoctorContact[]
  assignDoctor: (alertId: string, doctorId: string) => void
  
  // Alert actions
  sendAlertToDoctors: (alertId: string) => Promise<boolean>
  generateEmergencySummary: (patientId: string) => Promise<any>
  notifyEmergencyServices: (alertId: string) => boolean
}

export const useEmergencyStore = create<EmergencyStore>()(
  persist(
    (set, get) => ({
      alerts: [],
      doctors: [
        {
          id: 'doc_1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Emergency Medicine',
          phone: '+1-555-0123',
          email: 'sarah.johnson@hospital.com',
          isAvailable: true,
          isOnCall: true,
          hospital: 'City General Hospital',
          responseTime: 5
        },
        {
          id: 'doc_2',
          name: 'Dr. Michael Chen',
          specialty: 'Cardiology',
          phone: '+1-555-0124',
          email: 'michael.chen@hospital.com',
          isAvailable: true,
          isOnCall: false,
          hospital: 'Heart Health Clinic',
          responseTime: 15
        },
        {
          id: 'doc_3',
          name: 'Dr. Emily Rodriguez',
          specialty: 'General Practice',
          phone: '+1-555-0125',
          email: 'emily.rodriguez@clinic.com',
          isAvailable: false,
          isOnCall: false,
          hospital: 'Family Medical Center',
          responseTime: 30
        },
        {
          id: 'doc_4',
          name: 'Dr. James Wilson',
          specialty: 'Neurology',
          phone: '+1-555-0126',
          email: 'james.wilson@neuro.com',
          isAvailable: true,
          isOnCall: true,
          hospital: 'Neurology Institute',
          responseTime: 10
        }
      ],
      currentAlert: null,

      createEmergencyAlert: (alertData) => {
        const newAlert: EmergencyAlert = {
          ...alertData,
          id: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          status: 'active'
        }

        set((state) => ({
          alerts: [newAlert, ...state.alerts],
          currentAlert: newAlert
        }))

        // Auto-send alert to doctors
        get().sendAlertToDoctors(newAlert.id)

        return newAlert
      },

      updateAlertStatus: (alertId, status, response) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? {
                  ...alert,
                  status,
                  doctorResponse: response,
                  responseTime: status === 'acknowledged' ? new Date().toISOString() : alert.responseTime,
                  resolvedAt: status === 'resolved' ? new Date().toISOString() : alert.resolvedAt
                }
              : alert
          ),
          currentAlert: state.currentAlert?.id === alertId 
            ? { ...state.currentAlert, status, doctorResponse: response }
            : state.currentAlert
        }))
      },

      getActiveAlerts: () => {
        return get().alerts.filter(alert => alert.status === 'active')
      },

      getAlertById: (alertId) => {
        return get().alerts.find(alert => alert.id === alertId)
      },

      getAvailableDoctors: () => {
        return get().doctors.filter(doctor => doctor.isAvailable || doctor.isOnCall)
      },

      assignDoctor: (alertId, doctorId) => {
        const doctor = get().doctors.find(d => d.id === doctorId)
        if (doctor) {
          get().updateAlertStatus(alertId, 'acknowledged', `Dr. ${doctor.name} has been assigned to your case.`)
          
          set((state) => ({
            alerts: state.alerts.map((alert) =>
              alert.id === alertId ? { ...alert, assignedDoctor: doctor.name } : alert
            ),
            currentAlert: state.currentAlert?.id === alertId 
              ? { ...state.currentAlert, assignedDoctor: doctor.name }
              : state.currentAlert
          }))
        }
      },

      sendAlertToDoctors: async (alertId) => {
        const alert = get().getAlertById(alertId)
        if (!alert) return false

        const availableDoctors = get().getAvailableDoctors()
        
        try {
          // In a real implementation, this would send actual notifications
          // For demo purposes, we'll simulate the alert sending
          console.log('🚨 EMERGENCY ALERT SENT TO DOCTORS:', {
            alertId: alert.id,
            patient: alert.patientName,
            severity: alert.severity,
            symptoms: alert.symptoms,
            doctors: availableDoctors.map(d => d.name)
          })

          // Simulate API call to notification service
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Auto-assign the first available doctor for critical emergencies
          if (alert.emergencyType === 'critical' && availableDoctors.length > 0) {
            const firstDoctor = availableDoctors[0]
            get().assignDoctor(alertId, firstDoctor.id)
          }

          return true
        } catch (error) {
          console.error('Failed to send emergency alert:', error)
          return false
        }
      },

      generateEmergencySummary: async (patientId) => {
        // This would integrate with the reports store to get patient data
        const { useReportsStore } = await import('./reports-store')
        const reportsStore = useReportsStore.getState()
        
        const healthSummary = reportsStore.healthSummary
        const recentReports = reportsStore.getRecentReports(5)
        const criticalReports = reportsStore.getCriticalReports()

        return {
          healthSummary,
          recentReports: recentReports.map(r => ({
            title: r.title,
            type: r.type,
            status: r.status,
            date: r.date,
            keyFindings: r.keyFindings
          })),
          criticalReports: criticalReports.map(r => ({
            title: r.title,
            date: r.date,
            keyFindings: r.keyFindings
          }))
        }
      },

      notifyEmergencyServices: (alertId) => {
        const alert = get().getAlertById(alertId)
        if (!alert) return false

        // For critical emergencies, also notify emergency services
        if (alert.emergencyType === 'critical') {
          console.log('🚑 EMERGENCY SERVICES NOTIFIED:', {
            alertId: alert.id,
            patient: alert.patientName,
            location: alert.location,
            severity: alert.severity
          })

          // In a real implementation, this would call emergency services API
          // For demo, we'll just log it
          return true
        }

        return false
      }
    }),
    {
      name: 'emergency-alerts-storage',
    }
  )
)
