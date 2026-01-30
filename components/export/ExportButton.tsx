'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Printer, Mail, Share2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PDFGenerator } from '@/lib/pdf-generator'
import { cn } from '@/lib/utils'

interface ExportButtonProps {
  data?: any
  type?: 'medical-report' | 'patient-history' | 'documentation'
  elementId?: string
  filename?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  disabled?: boolean
}

export function ExportButton({
  data,
  type = 'medical-report',
  elementId,
  filename,
  variant = 'default',
  size = 'default',
  className,
  disabled = false
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handlePDFExport = async () => {
    setIsExporting(true)
    try {
      if (elementId) {
        await PDFGenerator.generateFromElement(elementId, { filename })
      } else if (data && type) {
        switch (type) {
          case 'medical-report':
            PDFGenerator.generateMedicalReport(data, { filename })
            break
          case 'patient-history':
            PDFGenerator.generatePatientHistory(data, { filename })
            break
          default:
            console.warn('Unknown export type:', type)
        }
      }
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
      setShowDropdown(false)
    }
  }

  const handlePrint = () => {
    if (elementId) {
      const element = document.getElementById(elementId)
      if (element) {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Document</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  @media print { body { margin: 0; } }
                </style>
              </head>
              <body>
                ${element.innerHTML}
              </body>
            </html>
          `)
          printWindow.document.close()
          printWindow.print()
        }
      }
    }
    setShowDropdown(false)
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(filename || 'Medical Document')
    const body = encodeURIComponent('Please find the attached medical document.')
    window.open(`mailto:?subject=${subject}&body=${body}`)
    setShowDropdown(false)
  }

  const handleShare = async () => {
    if (navigator.share && data) {
      try {
        await navigator.share({
          title: filename || 'Medical Document',
          text: 'Medical document from Asclepius Health System',
          url: window.location.href
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handlePDFExport}
        disabled={disabled || isExporting}
        className={cn('relative', className)}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {size !== 'sm' && <span className="ml-2">Export PDF</span>}
      </Button>

      {/* Additional export options */}
      <div className="absolute top-full right-0 mt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-6 w-6 p-0"
        >
          <Share2 className="w-3 h-3" />
        </Button>

        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 min-w-[160px]"
            >
              <div className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="w-full justify-start"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEmail}
                  className="w-full justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="w-full justify-start"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
