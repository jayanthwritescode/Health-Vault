import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Message, 
  PatientHistory, 
  MedicalDocumentation,
  UserSettings,
  Language,
  DemoPatient 
} from './types'

// Chat Store
interface ChatStore {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  updateLastMessage: (content: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, content } : msg
      ),
    })),
}))

// Patient History Store
interface PatientHistoryStore {
  currentHistory: Partial<PatientHistory> | null
  histories: PatientHistory[]
  updateHistory: (updates: Partial<PatientHistory>) => void
  saveHistory: (history: PatientHistory) => void
  clearCurrentHistory: () => void
  getHistoryById: (id: string) => PatientHistory | undefined
}

export const usePatientHistoryStore = create<PatientHistoryStore>()(
  persist(
    (set, get) => ({
      currentHistory: null,
      histories: [],
      updateHistory: (updates) =>
        set((state) => ({
          currentHistory: { ...state.currentHistory, ...updates },
        })),
      saveHistory: (history) =>
        set((state) => ({
          histories: [...state.histories, history],
          currentHistory: null,
        })),
      clearCurrentHistory: () => set({ currentHistory: null }),
      getHistoryById: (id) => get().histories.find((h) => h.id === id),
    }),
    {
      name: 'patient-history-storage',
    }
  )
)

// Documentation Store
interface DocumentationStore {
  documentations: MedicalDocumentation[]
  currentTranscript: string
  addDocumentation: (doc: MedicalDocumentation) => void
  setCurrentTranscript: (transcript: string) => void
  clearCurrentTranscript: () => void
}

export const useDocumentationStore = create<DocumentationStore>()(
  persist(
    (set) => ({
      documentations: [],
      currentTranscript: '',
      addDocumentation: (doc) =>
        set((state) => ({
          documentations: [...state.documentations, doc],
        })),
      setCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
      clearCurrentTranscript: () => set({ currentTranscript: '' }),
    }),
    {
      name: 'documentation-storage',
    }
  )
)

// Settings Store
interface SettingsStore {
  settings: UserSettings
  updateSettings: (updates: Partial<UserSettings>) => void
  setLanguage: (language: Language) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        language: 'en',
        theme: 'system',
        notifications: true,
        voiceEnabled: true,
        autoSave: true,
      },
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      setLanguage: (language) =>
        set((state) => ({
          settings: { ...state.settings, language },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
)

// Audio Recording Store
interface AudioStore {
  isRecording: boolean
  audioBlob: Blob | null
  duration: number
  setRecording: (recording: boolean) => void
  setAudioBlob: (blob: Blob | null) => void
  setDuration: (duration: number) => void
  reset: () => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  isRecording: false,
  audioBlob: null,
  duration: 0,
  setRecording: (recording) => set({ isRecording: recording }),
  setAudioBlob: (blob) => set({ audioBlob: blob }),
  setDuration: (duration) => set({ duration }),
  reset: () => set({ isRecording: false, audioBlob: null, duration: 0 }),
}))

// Demo Data Store
interface DemoStore {
  demoPatients: DemoPatient[]
  isDemoMode: boolean
  setDemoMode: (mode: boolean) => void
  addDemoPatient: (patient: DemoPatient) => void
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      demoPatients: [],
      isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
      setDemoMode: (mode) => set({ isDemoMode: mode }),
      addDemoPatient: (patient) =>
        set((state) => ({
          demoPatients: [...state.demoPatients, patient],
        })),
    }),
    {
      name: 'demo-storage',
    }
  )
)

// Analytics Store
interface AnalyticsStore {
  timeSaved: number
  patientsHelped: number
  documentationsGenerated: number
  incrementTimeSaved: (minutes: number) => void
  incrementPatientsHelped: () => void
  incrementDocumentations: () => void
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      timeSaved: 0,
      patientsHelped: 0,
      documentationsGenerated: 0,
      incrementTimeSaved: (minutes) =>
        set((state) => ({ timeSaved: state.timeSaved + minutes })),
      incrementPatientsHelped: () =>
        set((state) => ({ patientsHelped: state.patientsHelped + 1 })),
      incrementDocumentations: () =>
        set((state) => ({
          documentationsGenerated: state.documentationsGenerated + 1,
        })),
    }),
    {
      name: 'analytics-storage',
    }
  )
)
