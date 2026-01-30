import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MedicalReport {
  id: string
  title: string
  type: 'blood-test' | 'x-ray' | 'mri' | 'ct-scan' | 'ecg' | 'ultrasound' | 'pathology' | 'other'
  date: string
  doctor: string
  hospital: string
  status: 'normal' | 'abnormal' | 'critical' | 'pending'
  summary: string
  keyFindings: string[]
  recommendations: string[]
  fileUrl?: string
  fileName?: string
  fileSize?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface HealthSummary {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor'
  lastUpdated: string
  totalReports: number
  criticalReports: number
  abnormalReports: number
  normalReports: number
  recentReports: MedicalReport[]
  healthTrends: {
    category: string
    status: 'improving' | 'stable' | 'declining'
    description: string
  }[]
  upcomingCheckups: {
    type: string
    dueDate: string
    priority: 'high' | 'medium' | 'low'
  }[]
  medications: {
    name: string
    dosage: string
    frequency: string
    startDate: string
    endDate?: string
  }[]
  allergies: string[]
  conditions: string[]
}

interface ReportsStore {
  reports: MedicalReport[]
  healthSummary: HealthSummary | null
  
  // Report management
  addReport: (report: Omit<MedicalReport, 'id' | 'createdAt' | 'updatedAt'>) => MedicalReport
  updateReport: (id: string, updates: Partial<MedicalReport>) => void
  deleteReport: (id: string) => void
  getReportById: (id: string) => MedicalReport | undefined
  
  // Report filtering and sorting
  getReportsByType: (type: MedicalReport['type']) => MedicalReport[]
  getReportsByStatus: (status: MedicalReport['status']) => MedicalReport[]
  getRecentReports: (limit?: number) => MedicalReport[]
  getCriticalReports: () => MedicalReport[]
  searchReports: (query: string) => MedicalReport[]
  
  // Health summary
  generateHealthSummary: () => void
  updateHealthSummary: (updates: Partial<HealthSummary>) => void
  getHealthTrends: () => HealthSummary['healthTrends']
}

export const useReportsStore = create<ReportsStore>()(
  persist(
    (set, get) => ({
      reports: [],
      healthSummary: null,

      addReport: (reportData) => {
        const newReport: MedicalReport = {
          ...reportData,
          id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          reports: [...state.reports, newReport],
        }))

        // Auto-generate health summary when new report is added
        get().generateHealthSummary()

        return newReport
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date().toISOString() }
              : report
          ),
        }))

        // Update health summary when report is updated
        get().generateHealthSummary()
      },

      deleteReport: (id) => {
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        }))

        // Update health summary when report is deleted
        get().generateHealthSummary()
      },

      getReportById: (id) => {
        return get().reports.find((report) => report.id === id)
      },

      getReportsByType: (type) => {
        return get().reports
          .filter((report) => report.type === type)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getReportsByStatus: (status) => {
        return get().reports
          .filter((report) => report.status === status)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      getRecentReports: (limit = 5) => {
        return get().reports
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)
      },

      getCriticalReports: () => {
        return get().reports
          .filter((report) => report.status === 'critical')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },

      searchReports: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().reports.filter(
          (report) =>
            report.title.toLowerCase().includes(lowerQuery) ||
            report.type.toLowerCase().includes(lowerQuery) ||
            report.doctor.toLowerCase().includes(lowerQuery) ||
            report.hospital.toLowerCase().includes(lowerQuery) ||
            report.summary.toLowerCase().includes(lowerQuery) ||
            report.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        )
      },

      generateHealthSummary: () => {
        const reports = get().reports
        if (reports.length === 0) return

        const totalReports = reports.length
        const criticalReports = reports.filter(r => r.status === 'critical').length
        const abnormalReports = reports.filter(r => r.status === 'abnormal').length
        const normalReports = reports.filter(r => r.status === 'normal').length

        // Determine overall health status
        let overallHealth: HealthSummary['overallHealth'] = 'excellent'
        if (criticalReports > 0) {
          overallHealth = 'poor'
        } else if (abnormalReports > 2) {
          overallHealth = 'fair'
        } else if (abnormalReports > 0) {
          overallHealth = 'good'
        }

        // Generate health trends based on recent reports
        const recentReports = reports.slice(0, 10)
        const healthTrends: HealthSummary['healthTrends'] = [
          {
            category: 'Overall Health',
            status: criticalReports > 0 ? 'declining' : abnormalReports > 0 ? 'stable' : 'improving',
            description: criticalReports > 0 
              ? 'Critical findings require immediate attention'
              : abnormalReports > 0 
              ? 'Some abnormal results need monitoring'
              : 'Health indicators are positive'
          },
          {
            category: 'Report Frequency',
            status: recentReports.length > 5 ? 'stable' : 'improving',
            description: `Recent activity: ${recentReports.length} reports in last 30 days`
          }
        ]

        // Extract common conditions and medications from reports
        const allTags = reports.flatMap(r => r.tags)
        const conditions = [...new Set(allTags.filter(tag => 
          tag.toLowerCase().includes('diabetes') || 
          tag.toLowerCase().includes('hypertension') || 
          tag.toLowerCase().includes('cholesterol') ||
          tag.toLowerCase().includes('thyroid')
        ))]

        const allergies = [...new Set(allTags.filter(tag => 
          tag.toLowerCase().includes('allergy') || 
          tag.toLowerCase().includes('allergic')
        ))]

        const healthSummary: HealthSummary = {
          overallHealth,
          lastUpdated: new Date().toISOString(),
          totalReports,
          criticalReports,
          abnormalReports,
          normalReports,
          recentReports: get().getRecentReports(5),
          healthTrends,
          upcomingCheckups: [
            {
              type: 'General Health Check',
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              priority: criticalReports > 0 ? 'high' : 'medium'
            }
          ],
          medications: [],
          allergies,
          conditions
        }

        set({ healthSummary })
      },

      updateHealthSummary: (updates) => {
        set((state) => ({
          healthSummary: state.healthSummary 
            ? { ...state.healthSummary, ...updates, lastUpdated: new Date().toISOString() }
            : null
        }))
      },

      getHealthTrends: () => {
        return get().healthSummary?.healthTrends || []
      }
    }),
    {
      name: 'medical-reports-storage',
    }
  )
)
