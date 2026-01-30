import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Appointment {
  id: string
  patientName: string
  patientEmail?: string
  patientPhone?: string
  doctorName: string
  specialty: string
  date: string // ISO date string
  time: string // HH:MM format
  duration: number // minutes
  type: 'in-person' | 'video' | 'phone'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  reason: string
  notes?: string
  patientHistory?: string // Reference to patient history ID
  createdAt: string
  updatedAt: string
}

interface AppointmentStore {
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Appointment
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  cancelAppointment: (id: string) => void
  getUpcomingAppointments: () => Appointment[]
  getPastAppointments: () => Appointment[]
  getTodayAppointments: () => Appointment[]
  getAppointmentById: (id: string) => Appointment | undefined
  getAppointmentsByDate: (date: string) => Appointment[]
}

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      appointments: [],

      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }))

        return newAppointment
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
              : apt
          ),
        }))
      },

      cancelAppointment: (id) => {
        get().updateAppointment(id, { status: 'cancelled' })
      },

      getUpcomingAppointments: () => {
        const now = new Date()
        return get()
          .appointments.filter((apt) => {
            const aptDate = new Date(`${apt.date}T${apt.time}`)
            return aptDate >= now && apt.status !== 'cancelled' && apt.status !== 'completed'
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateA.getTime() - dateB.getTime()
          })
      },

      getPastAppointments: () => {
        const now = new Date()
        return get()
          .appointments.filter((apt) => {
            const aptDate = new Date(`${apt.date}T${apt.time}`)
            return aptDate < now || apt.status === 'completed' || apt.status === 'cancelled'
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateB.getTime() - dateA.getTime()
          })
      },

      getTodayAppointments: () => {
        const today = new Date().toISOString().split('T')[0]
        return get()
          .appointments.filter((apt) => apt.date === today && apt.status !== 'cancelled')
          .sort((a, b) => a.time.localeCompare(b.time))
      },

      getAppointmentById: (id) => {
        return get().appointments.find((apt) => apt.id === id)
      },

      getAppointmentsByDate: (date) => {
        return get()
          .appointments.filter((apt) => apt.date === date && apt.status !== 'cancelled')
          .sort((a, b) => a.time.localeCompare(b.time))
      },
    }),
    {
      name: 'appointments-storage',
    }
  )
)
