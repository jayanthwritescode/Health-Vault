// Core Types
export type UserRole = 'doctor' | 'patient'
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn'
export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'non-urgent'

// Chat Types
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  emotion?: 'neutral' | 'concerned' | 'empathetic' | 'urgent'
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  userId: string
  messages: Message[]
  context: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Medical History Types
export interface PatientHistory {
  id: string
  patientId: string
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string[]
  medications?: Medication[]
  allergies?: Allergy[]
  familyHistory?: string
  socialHistory?: SocialHistory
  reviewOfSystems?: ReviewOfSystems
  completionPercentage: number
  urgencyLevel: UrgencyLevel
  redFlags: string[]
  collectedAt: Date
  conversationId: string
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  duration?: string
  reason?: string
}

export interface Allergy {
  allergen: string
  reaction: string
  severity: 'mild' | 'moderate' | 'severe'
}

export interface SocialHistory {
  smoking?: string
  alcohol?: string
  drugs?: string
  occupation?: string
  exercise?: string
  diet?: string
}

export interface ReviewOfSystems {
  constitutional?: string[]
  cardiovascular?: string[]
  respiratory?: string[]
  gastrointestinal?: string[]
  genitourinary?: string[]
  musculoskeletal?: string[]
  neurological?: string[]
  psychiatric?: string[]
  endocrine?: string[]
  hematologic?: string[]
  allergicImmunologic?: string[]
}

// Documentation Types
export interface SOAPNotes {
  subjective: string
  objective: string
  assessment: string
  plan: string
  differentialDiagnosis?: string[]
  redFlags?: string[]
  followUp?: string
}

export interface MedicalDocumentation {
  id: string
  patientId: string
  doctorId: string
  date: Date
  transcript: string
  soapNotes: SOAPNotes
  icd10Codes: ICD10Code[]
  cptCodes: CPTCode[]
  prescription?: Prescription
  patientEducation?: string
  insuranceSummary?: string
}

export interface ICD10Code {
  code: string
  description: string
  confidence: number
}

export interface CPTCode {
  code: string
  description: string
  confidence: number
}

export interface Prescription {
  medications: PrescriptionMedication[]
  instructions: string
  refills?: number
  validUntil?: Date
}

export interface PrescriptionMedication {
  name: string
  genericName?: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  instructions: string
  interactions?: string[]
}

// Audio Types
export interface AudioRecording {
  id: string
  blob: Blob
  duration: number
  timestamp: Date
}

export interface TranscriptionResult {
  text: string
  confidence: number
  segments?: TranscriptionSegment[]
  language?: string
}

export interface TranscriptionSegment {
  text: string
  start: number
  end: number
  speaker?: 'doctor' | 'patient'
  confidence: number
}

// Patient Assistant Types
export type AssistantFeature = 
  | 'report-explainer'
  | 'appointment-scheduler'
  | 'medication-assistant'
  | 'symptom-checker'
  | 'health-info'

export interface LabReport {
  id: string
  patientId: string
  testName: string
  date: Date
  results: LabResult[]
  interpretation?: string
}

export interface LabResult {
  parameter: string
  value: string
  unit: string
  referenceRange: string
  status: 'normal' | 'low' | 'high' | 'critical'
}

export interface Appointment {
  id: string
  patientId: string
  doctorId?: string
  specialty?: string
  date: Date
  time: string
  type: 'in-person' | 'telemedicine'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  reason?: string
  notes?: string
}

// History Collection Progress
export interface HistoryCollectionProgress {
  chiefComplaint: boolean
  historyOfPresentIllness: boolean
  pastMedicalHistory: boolean
  medications: boolean
  allergies: boolean
  familyHistory: boolean
  socialHistory: boolean
  reviewOfSystems: boolean
}

// Demo Data Types
export interface DemoPatient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  chiefComplaint: string
  history?: PatientHistory
  urgencyLevel: UrgencyLevel
  completionPercentage: number
  submittedAt: Date
}

// Settings Types
export interface UserSettings {
  language: Language
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  voiceEnabled: boolean
  autoSave: boolean
  specialty?: string
}

// Analytics Types
export interface Analytics {
  timeSaved: number // in minutes
  patientsHelped: number
  documentationsGenerated: number
  averageCompletionTime: number
}
