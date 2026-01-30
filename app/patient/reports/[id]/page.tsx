'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Calendar,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Edit,
  Trash2,
  Printer,
  Mail,
  MessageSquare,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { useReportsStore, MedicalReport } from '@/lib/reports-store'
import { PDFGenerator } from '@/lib/pdf-generator'

function ReportDetailContent() {
  const router = useRouter()
  const params = useParams()
  const reportId = params.id as string
  
  const { getReportById, updateReport, deleteReport } = useReportsStore()
  const [report, setReport] = useState<MedicalReport | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedReport, setEditedReport] = useState<MedicalReport | null>(null)

  useEffect(() => {
    if (reportId) {
      const foundReport = getReportById(reportId)
      if (foundReport) {
        setReport(foundReport)
        setEditedReport(foundReport)
      } else {
        // Report not found, redirect to dashboard
        router.push('/patient/dashboard')
      }
    }
  }, [reportId, getReportById, router])

  const getStatusColor = (status: MedicalReport['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200'
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: MedicalReport['status']) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />
      case 'abnormal': return <Info className="w-4 h-4" />
      case 'critical': return <AlertTriangle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadPDF = async () => {
    if (!report) return
    
    try {
      const pdfGenerator = new PDFGenerator()
      // Generate PDF from the report detail element
      await pdfGenerator.generateFromElement('report-content')
    } catch (error) {
      console.error('PDF generation error:', error)
    }
  }

  const handleShare = async () => {
    if (!report) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: report.title,
          text: `Medical Report: ${report.title} - ${formatDate(report.date)}`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Share error:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleEmail = () => {
    if (!report) return
    
    const subject = `Medical Report: ${report.title}`
    const body = `Please find my medical report details:\n\nTitle: ${report.title}\nDate: ${formatDate(report.date)}\nDoctor: ${report.doctor}\nHospital: ${report.hospital}\n\nView full report: ${window.location.href}`
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    if (editedReport && report) {
      updateReport(report.id, editedReport)
      setReport(editedReport)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    if (report && confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      deleteReport(report.id)
      router.push('/patient/dashboard')
    }
  }

  const handleAIAnalysis = () => {
    if (!report) return
    
    // Navigate to AI assistant with report context
    router.push(`/patient/assistant?report=${report.id}`)
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-lg font-bold tracking-tight">Medical Report</span>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {report.title}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    Save
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsEditing(false)
                      setEditedReport(report)
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleAIAnalysis} size="sm" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    AI Analysis
                  </Button>
                  <Button onClick={handleDownloadPDF} size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleShare} size="sm" variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleDelete} size="sm" variant="outline" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div id="report-content" className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Report Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={getStatusColor(report.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </Badge>
                      <Badge variant="outline">
                        {report.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedReport?.title || ''}
                          onChange={(e) => setEditedReport(prev => prev ? {...prev, title: e.target.value} : null)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      ) : (
                        report.title
                      )}
                    </CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(report.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedReport?.doctor || ''}
                            onChange={(e) => setEditedReport(prev => prev ? {...prev, doctor: e.target.value} : null)}
                            className="px-2 py-1 border border-border rounded-md bg-background"
                          />
                        ) : (
                          report.doctor
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedReport?.hospital || ''}
                            onChange={(e) => setEditedReport(prev => prev ? {...prev, hospital: e.target.value} : null)}
                            className="px-2 py-1 border border-border rounded-md bg-background"
                          />
                        ) : (
                          report.hospital
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Report Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <textarea
                        value={editedReport?.summary || ''}
                        onChange={(e) => setEditedReport(prev => prev ? {...prev, summary: e.target.value} : null)}
                        className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background"
                        placeholder="Enter report summary..."
                      />
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {report.summary}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Key Findings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Key Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        {editedReport?.keyFindings.map((finding, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={finding}
                              onChange={(e) => {
                                const newFindings = [...(editedReport?.keyFindings || [])]
                                newFindings[index] = e.target.value
                                setEditedReport(prev => prev ? {...prev, keyFindings: newFindings} : null)
                              }}
                              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newFindings = [...(editedReport?.keyFindings || [])]
                                newFindings.splice(index, 1)
                                setEditedReport(prev => prev ? {...prev, keyFindings: newFindings} : null)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newFindings = [...(editedReport?.keyFindings || []), '']
                            setEditedReport(prev => prev ? {...prev, keyFindings: newFindings} : null)
                          }}
                        >
                          Add Finding
                        </Button>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {report.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        {editedReport?.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={recommendation}
                              onChange={(e) => {
                                const newRecommendations = [...(editedReport?.recommendations || [])]
                                newRecommendations[index] = e.target.value
                                setEditedReport(prev => prev ? {...prev, recommendations: newRecommendations} : null)
                              }}
                              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newRecommendations = [...(editedReport?.recommendations || [])]
                                newRecommendations.splice(index, 1)
                                setEditedReport(prev => prev ? {...prev, recommendations: newRecommendations} : null)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newRecommendations = [...(editedReport?.recommendations || []), '']
                            setEditedReport(prev => prev ? {...prev, recommendations: newRecommendations} : null)
                          }}
                        >
                          Add Recommendation
                        </Button>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {report.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={handleAIAnalysis} className="w-full flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Get AI Analysis
                    </Button>
                    <Button onClick={handleDownloadPDF} variant="outline" className="w-full flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    <Button onClick={handleEmail} variant="outline" className="w-full flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Report
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="w-full flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Print Report
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Report Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Report Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium">Report ID</div>
                      <div className="text-muted-foreground">{report.id}</div>
                    </div>
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-muted-foreground">{formatDate(report.createdAt)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div className="text-muted-foreground">{formatDate(report.updatedAt)}</div>
                    </div>
                    {report.fileName && (
                      <div>
                        <div className="font-medium">File Name</div>
                        <div className="text-muted-foreground">{report.fileName}</div>
                      </div>
                    )}
                    {report.fileSize && (
                      <div>
                        <div className="font-medium">File Size</div>
                        <div className="text-muted-foreground">{(report.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    }>
      <ReportDetailContent />
    </Suspense>
  )
}
