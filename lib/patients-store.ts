import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  bloodGroup?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalHistory: {
    conditions: string[]
    allergies: string[]
    medications: string[]
    surgeries: string[]
  }
  lastVisit?: string
  nextAppointment?: string
  totalVisits: number
  status: 'active' | 'inactive'
  notes?: string
  registeredAt: string
  updatedAt: string
}

interface PatientStore {
  patients: Patient[]
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt' | 'updatedAt' | 'totalVisits'>) => Patient
  updatePatient: (id: string, updates: Partial<Patient>) => void
  deletePatient: (id: string) => void
  getPatientById: (id: string) => Patient | undefined
  getActivePatients: () => Patient[]
  getRecentPatients: (limit?: number) => Patient[]
  searchPatients: (query: string) => Patient[]
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: [],

      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          totalVisits: 0,
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          patients: [...state.patients, newPatient],
        }))

        return newPatient
      },

      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === id
              ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
              : patient
          ),
        }))
      },

      deletePatient: (id) => {
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== id),
        }))
      },

      getPatientById: (id) => {
        return get().patients.find((patient) => patient.id === id)
      },

      getActivePatients: () => {
        return get()
          .patients.filter((patient) => patient.status === 'active')
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      },

      getRecentPatients: (limit = 5) => {
        return get()
          .patients.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, limit)
      },

      searchPatients: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().patients.filter(
          (patient) =>
            patient.name.toLowerCase().includes(lowerQuery) ||
            patient.email?.toLowerCase().includes(lowerQuery) ||
            patient.phone?.includes(query)
        )
      },
    }),
    {
      name: 'patients-storage',
    }
  )
)
