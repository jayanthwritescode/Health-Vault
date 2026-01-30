import { create } from 'zustand'
import { 
  demoPatients, 
  demoAppointments, 
  demoMedicalReports, 
  demoConversations, 
  demoDocumentation,
  demoSymptoms,
  demoMedications,
  generateRandomPatient,
  generateRandomAppointment
} from './demo-data'

interface DemoStore {
  // Demo mode state
  isDemoMode: boolean
  enableDemoMode: () => void
  disableDemoMode: () => void
  
  // Demo data
  patients: any[]
  appointments: any[]
  medicalReports: any[]
  conversations: any[]
  documentation: any[]
  symptoms: any[]
  medications: any[]
  
  // Actions
  addPatient: (patient: any) => void
  updatePatient: (id: string, updates: any) => void
  deletePatient: (id: string) => void
  
  addAppointment: (appointment: any) => void
  updateAppointment: (id: string, updates: any) => void
  deleteAppointment: (id: string) => void
  
  addMedicalReport: (report: any) => void
  updateMedicalReport: (id: string, updates: any) => void
  
  addConversation: (conversation: any) => void
  updateConversation: (id: string, updates: any) => void
  
  // Generate random data
  generateRandomData: (count?: number) => void
  clearAllData: () => void
}

export const useDemoStore = create<DemoStore>((set, get) => ({
  // Demo mode state
  isDemoMode: false,
  enableDemoMode: () => set({ isDemoMode: true }),
  disableDemoMode: () => set({ isDemoMode: false }),
  
  // Demo data
  patients: demoPatients,
  appointments: demoAppointments,
  medicalReports: demoMedicalReports,
  conversations: demoConversations,
  documentation: demoDocumentation,
  symptoms: demoSymptoms,
  medications: demoMedications,
  
  // Patient actions
  addPatient: (patient) => set((state) => ({
    patients: [...state.patients, { ...patient, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updatePatient: (id, updates) => set((state) => ({
    patients: state.patients.map(patient => 
      patient.id === id ? { ...patient, ...updates } : patient
    )
  })),
  
  deletePatient: (id) => set((state) => ({
    patients: state.patients.filter(patient => patient.id !== id)
  })),
  
  // Appointment actions
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, { ...appointment, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    )
  })),
  
  deleteAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(appointment => appointment.id !== id)
  })),
  
  // Medical report actions
  addMedicalReport: (report) => set((state) => ({
    medicalReports: [...state.medicalReports, { ...report, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updateMedicalReport: (id, updates) => set((state) => ({
    medicalReports: state.medicalReports.map(report => 
      report.id === id ? { ...report, ...updates } : report
    )
  })),
  
  // Conversation actions
  addConversation: (conversation) => set((state) => ({
    conversations: [...state.conversations, { ...conversation, id: Math.random().toString(36).substr(2, 9) }]
  })),
  
  updateConversation: (id, updates) => set((state) => ({
    conversations: state.conversations.map(conversation => 
      conversation.id === id ? { ...conversation, ...updates } : conversation
    )
  })),
  
  // Generate random data
  generateRandomData: (count = 5) => {
    const newPatients = Array.from({ length: count }, () => generateRandomPatient())
    const newAppointments = newPatients.map(patient => generateRandomAppointment(patient.id))
    
    set((state) => ({
      patients: [...state.patients, ...newPatients],
      appointments: [...state.appointments, ...newAppointments]
    }))
  },
  
  // Clear all data
  clearAllData: () => set({
    patients: [],
    appointments: [],
    medicalReports: [],
    conversations: [],
    documentation: []
  })
}))

// Hook for demo mode
export const useDemoMode = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoStore()
  
  return {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    toggleDemoMode: () => {
      if (isDemoMode) {
        disableDemoMode()
      } else {
        enableDemoMode()
      }
    }
  }
}

// Demo data selectors
export const useDemoPatients = () => useDemoStore((state) => state.patients)
export const useDemoAppointments = () => useDemoStore((state) => state.appointments)
export const useDemoMedicalReports = () => useDemoStore((state) => state.medicalReports)
export const useDemoConversations = () => useDemoStore((state) => state.conversations)
export const useDemoDocumentation = () => useDemoStore((state) => state.documentation)
export const useDemoSymptoms = () => useDemoStore((state) => state.symptoms)
export const useDemoMedications = () => useDemoStore((state) => state.medications)
