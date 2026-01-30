import { PDFGenerator } from '@/lib/pdf-generator'

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      getPageSize: jest.fn().mockReturnValue({
        getWidth: jest.fn().mockReturnValue(210),
        getHeight: jest.fn().mockReturnValue(297)
      })
    },
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setTextColor: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(['Test text']),
    text: jest.fn(),
    addImage: jest.fn(),
    save: jest.fn(),
    addPage: jest.fn()
  }))
})

// Mock html2canvas
jest.mock('html2canvas', () => {
  return jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
    width: 800,
    height: 600
  })
})

describe('PDFGenerator', () => {
  let pdfGenerator: PDFGenerator

  beforeEach(() => {
    pdfGenerator = new PDFGenerator()
  })

  describe('constructor', () => {
    it('creates instance with default options', () => {
      const generator = new PDFGenerator()
      expect(generator).toBeInstanceOf(PDFGenerator)
    })

    it('creates instance with custom options', () => {
      const options = {
        filename: 'custom.pdf',
        format: 'letter' as const,
        orientation: 'landscape' as const
      }
      const generator = new PDFGenerator(options)
      expect(generator).toBeInstanceOf(PDFGenerator)
    })
  })

  describe('generateMedicalReport', () => {
    const mockReportData = {
      patientName: 'John Doe',
      patientAge: 45,
      patientGender: 'Male',
      date: '2024-01-15',
      chiefComplaint: 'Chest pain',
      diagnosis: ['Hypertension', 'Diabetes'],
      medications: ['Lisinopril 10mg', 'Metformin 500mg'],
      recommendations: ['Exercise regularly', 'Follow up in 3 months'],
      followUp: 'Return in 3 months',
      doctorName: 'Dr. Smith',
      doctorSpecialty: 'Cardiology'
    }

    it('generates medical report without errors', () => {
      expect(() => {
        pdfGenerator.generateMedicalReport(mockReportData)
      }).not.toThrow()
    })

    it('generates report with minimal data', () => {
      const minimalData = {
        patientName: 'Jane Doe',
        patientAge: 30,
        patientGender: 'Female',
        date: '2024-01-15',
        chiefComplaint: 'Headache',
        doctorName: 'Dr. Johnson',
        doctorSpecialty: 'General Practice'
      }

      expect(() => {
        pdfGenerator.generateMedicalReport(minimalData)
      }).not.toThrow()
    })
  })

  describe('generatePatientHistory', () => {
    const mockHistoryData = {
      patientName: 'John Doe',
      patientAge: 45,
      patientGender: 'Male',
      date: '2024-01-15',
      chiefComplaint: 'Chest pain',
      historyOfPresentIllness: 'Patient reports chest pain for 2 weeks',
      pastMedicalHistory: ['Hypertension', 'Diabetes'],
      medications: ['Lisinopril 10mg', 'Metformin 500mg'],
      allergies: ['Penicillin'],
      familyHistory: 'Father had heart disease',
      socialHistory: 'Non-smoker, occasional alcohol',
      reviewOfSystems: 'Constitutional: Positive for fatigue',
      urgencyLevel: 'urgent',
      redFlags: ['Chest pain with exertion']
    }

    it('generates patient history without errors', () => {
      expect(() => {
        pdfGenerator.generatePatientHistory(mockHistoryData)
      }).not.toThrow()
    })

    it('generates history without red flags', () => {
      const dataWithoutRedFlags = {
        ...mockHistoryData,
        redFlags: []
      }

      expect(() => {
        pdfGenerator.generatePatientHistory(dataWithoutRedFlags)
      }).not.toThrow()
    })
  })

  describe('static methods', () => {
    it('has static method generateFromElement', () => {
      expect(typeof PDFGenerator.generateFromElement).toBe('function')
    })

    it('has static method generateMedicalReport', () => {
      expect(typeof PDFGenerator.generateMedicalReport).toBe('function')
    })

    it('has static method generatePatientHistory', () => {
      expect(typeof PDFGenerator.generatePatientHistory).toBe('function')
    })
  })

  describe('error handling', () => {
    it('handles missing element gracefully', async () => {
      await expect(
        PDFGenerator.generateFromElement('non-existent-id')
      ).rejects.toThrow('Element with id "non-existent-id" not found')
    })
  })
})
