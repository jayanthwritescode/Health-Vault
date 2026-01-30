import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFGenerationOptions {
  filename?: string
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  quality?: number
  scale?: number
}

export class PDFGenerator {
  private doc: jsPDF
  private options: Required<PDFGenerationOptions>

  constructor(options: PDFGenerationOptions = {}) {
    this.options = {
      filename: options.filename || 'document.pdf',
      format: options.format || 'a4',
      orientation: options.orientation || 'portrait',
      quality: options.quality || 0.95,
      scale: options.scale || 2
    }

    this.doc = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.format
    })
  }

  async generateFromElement(elementId: string): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    // Show loading state
    const originalStyle = element.style.overflow
    element.style.overflow = 'visible'

    try {
      // Generate canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: this.options.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Get image dimensions
      const imgData = canvas.toDataURL('image/png', this.options.quality)
      const imgWidth = this.doc.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add image to PDF
      this.doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // Save the PDF
      this.doc.save(this.options.filename)
    } finally {
      // Restore original style
      element.style.overflow = originalStyle
    }
  }

  generateMedicalReport(data: {
    patientName: string
    patientAge: number
    patientGender: string
    date: string
    chiefComplaint: string
    diagnosis?: string[]
    medications?: string[]
    recommendations?: string[]
    followUp?: string
    doctorName: string
    doctorSpecialty: string
  }): void {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    let yPosition = 20
    const lineHeight = 7
    const sectionSpacing = 10

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize = 12, fontStyle = 'normal') => {
      this.doc.setFontSize(fontSize)
      this.doc.setFont('helvetica', fontStyle)
      const lines = this.doc.splitTextToSize(text, pageWidth - 40)
      this.doc.text(lines, 20, yPosition)
      yPosition += lines.length * lineHeight * (fontSize / 12)
      return yPosition
    }

    // Header
    this.doc.setFillColor(59, 130, 246) // Blue color
    this.doc.rect(0, 0, pageWidth, 40, 'F')
    
    this.doc.setTextColor(255, 255, 255)
    addText('MEDICAL REPORT', 18, 'bold')
    addText('Asclepius Health System', 14, 'normal')
    
    this.doc.setTextColor(0, 0, 0)
    yPosition = 50

    // Patient Information
    addText('PATIENT INFORMATION', 14, 'bold')
    yPosition += 5
    addText(`Name: ${data.patientName}`)
    addText(`Age: ${data.patientAge} years`)
    addText(`Gender: ${data.patientGender}`)
    addText(`Date: ${data.date}`)
    yPosition += sectionSpacing

    // Chief Complaint
    addText('CHIEF COMPLAINT', 14, 'bold')
    yPosition += 5
    addText(data.chiefComplaint)
    yPosition += sectionSpacing

    // Diagnosis (if provided)
    if (data.diagnosis && data.diagnosis.length > 0) {
      addText('DIAGNOSIS', 14, 'bold')
      yPosition += 5
      data.diagnosis.forEach(diagnosis => {
        addText(`• ${diagnosis}`)
      })
      yPosition += sectionSpacing
    }

    // Medications (if provided)
    if (data.medications && data.medications.length > 0) {
      addText('MEDICATIONS', 14, 'bold')
      yPosition += 5
      data.medications.forEach(medication => {
        addText(`• ${medication}`)
      })
      yPosition += sectionSpacing
    }

    // Recommendations (if provided)
    if (data.recommendations && data.recommendations.length > 0) {
      addText('RECOMMENDATIONS', 14, 'bold')
      yPosition += 5
      data.recommendations.forEach(recommendation => {
        addText(`• ${recommendation}`)
      })
      yPosition += sectionSpacing
    }

    // Follow-up (if provided)
    if (data.followUp) {
      addText('FOLLOW-UP', 14, 'bold')
      yPosition += 5
      addText(data.followUp)
      yPosition += sectionSpacing
    }

    // Doctor Information
    addText('ATTENDING PHYSICIAN', 14, 'bold')
    yPosition += 5
    addText(`Dr. ${data.doctorName}`)
    addText(`${data.doctorSpecialty}`)

    // Footer
    const footerY = pageHeight - 20
    this.doc.setFontSize(10)
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(
      'This document is generated electronically and does not require a handwritten signature.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )
    this.doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    )

    // Save the PDF
    this.doc.save(`${data.patientName.replace(/\s+/g, '_')}_Medical_Report_${data.date}.pdf`)
  }

  generatePatientHistory(data: {
    patientName: string
    patientAge: number
    patientGender: string
    date: string
    chiefComplaint: string
    historyOfPresentIllness: string
    pastMedicalHistory: string[]
    medications: string[]
    allergies: string[]
    familyHistory: string
    socialHistory: string
    reviewOfSystems: string
    urgencyLevel: string
    redFlags: string[]
  }): void {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    const pageHeight = this.doc.internal.pageSize.getHeight()
    let yPosition = 20
    const lineHeight = 7
    const sectionSpacing = 10

    const addText = (text: string, fontSize = 12, fontStyle = 'normal') => {
      this.doc.setFontSize(fontSize)
      this.doc.setFont('helvetica', fontStyle)
      const lines = this.doc.splitTextToSize(text, pageWidth - 40)
      this.doc.text(lines, 20, yPosition)
      yPosition += lines.length * lineHeight * (fontSize / 12)
      
      // Add new page if needed
      if (yPosition > pageHeight - 40) {
        this.doc.addPage()
        yPosition = 20
      }
      
      return yPosition
    }

    // Header
    this.doc.setFillColor(34, 197, 94) // Green color
    this.doc.rect(0, 0, pageWidth, 40, 'F')
    
    this.doc.setTextColor(255, 255, 255)
    addText('PATIENT HISTORY', 18, 'bold')
    addText('Pre-Consultation Summary', 14, 'normal')
    
    this.doc.setTextColor(0, 0, 0)
    yPosition = 50

    // Patient Information
    addText('PATIENT INFORMATION', 14, 'bold')
    yPosition += 5
    addText(`Name: ${data.patientName}`)
    addText(`Age: ${data.patientAge} years`)
    addText(`Gender: ${data.patientGender}`)
    addText(`Date: ${data.date}`)
    addText(`Urgency Level: ${data.urgencyLevel.toUpperCase()}`)
    yPosition += sectionSpacing

    // Chief Complaint
    addText('CHIEF COMPLAINT', 14, 'bold')
    yPosition += 5
    addText(data.chiefComplaint)
    yPosition += sectionSpacing

    // History of Present Illness
    addText('HISTORY OF PRESENT ILLNESS', 14, 'bold')
    yPosition += 5
    addText(data.historyOfPresentIllness)
    yPosition += sectionSpacing

    // Past Medical History
    addText('PAST MEDICAL HISTORY', 14, 'bold')
    yPosition += 5
    data.pastMedicalHistory.forEach(condition => {
      addText(`• ${condition}`)
    })
    yPosition += sectionSpacing

    // Medications
    addText('CURRENT MEDICATIONS', 14, 'bold')
    yPosition += 5
    data.medications.forEach(medication => {
      addText(`• ${medication}`)
    })
    yPosition += sectionSpacing

    // Allergies
    addText('ALLERGIES', 14, 'bold')
    yPosition += 5
    data.allergies.forEach(allergy => {
      addText(`• ${allergy}`)
    })
    yPosition += sectionSpacing

    // Family History
    addText('FAMILY HISTORY', 14, 'bold')
    yPosition += 5
    addText(data.familyHistory)
    yPosition += sectionSpacing

    // Social History
    addText('SOCIAL HISTORY', 14, 'bold')
    yPosition += 5
    addText(data.socialHistory)
    yPosition += sectionSpacing

    // Review of Systems
    addText('REVIEW OF SYSTEMS', 14, 'bold')
    yPosition += 5
    addText(data.reviewOfSystems)
    yPosition += sectionSpacing

    // Red Flags (if any)
    if (data.redFlags.length > 0) {
      this.doc.setTextColor(239, 68, 68) // Red color
      addText('⚠️ RED FLAGS', 14, 'bold')
      yPosition += 5
      data.redFlags.forEach(flag => {
        addText(`• ${flag}`)
      })
      this.doc.setTextColor(0, 0, 0)
      yPosition += sectionSpacing
    }

    // Footer
    const footerY = pageHeight - 20
    this.doc.setFontSize(10)
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(
      'This document is for medical professional use only.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )
    this.doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      footerY + 5,
      { align: 'center' }
    )

    // Save the PDF
    this.doc.save(`${data.patientName.replace(/\s+/g, '_')}_Patient_History_${data.date}.pdf`)
  }

  // Static method for quick PDF generation
  static async generateFromElement(elementId: string, options?: PDFGenerationOptions): Promise<void> {
    const generator = new PDFGenerator(options)
    await generator.generateFromElement(elementId)
  }

  static generateMedicalReport(data: any, options?: PDFGenerationOptions): void {
    const generator = new PDFGenerator(options)
    generator.generateMedicalReport(data)
  }

  static generatePatientHistory(data: any, options?: PDFGenerationOptions): void {
    const generator = new PDFGenerator(options)
    generator.generatePatientHistory(data)
  }
}
