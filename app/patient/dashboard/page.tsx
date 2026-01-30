'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Activity,
  Heart,
  Brain,
  Stethoscope,
  ArrowRight,
  Plus,
  BarChart3,
  Pill,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { useReportsStore, MedicalReport, HealthSummary } from '@/lib/reports-store'
import { useAppointmentStore } from '@/lib/appointments-store'
import { initializeDemoReports } from '@/lib/demo-reports'

export default function PatientDashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  const { 
    reports, 
    healthSummary, 
    getRecentReports, 
    getCriticalReports, 
    searchReports,
    getReportsByType,
    getReportsByStatus
  } = useReportsStore()
  
  const { getUpcomingAppointments } = useAppointmentStore()
  const upcomingAppointments = getUpcomingAppointments()

  useEffect(() => {
    // Initialize demo reports if store is empty
    initializeDemoReports()
    
    // Generate health summary if not exists
    if (!healthSummary && reports.length > 0) {
      useReportsStore.getState().generateHealthSummary()
    }
  }, [reports, healthSummary])

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const recentReports = getRecentReports(3)
  const criticalReports = getCriticalReports()

  const getHealthStatusColor = (status: HealthSummary['overallHealth']) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getReportTypeIcon = (type: MedicalReport['type']) => {
    switch (type) {
      case 'blood-test': return <Activity className="w-4 h-4" />
      case 'x-ray': return <Eye className="w-4 h-4" />
      case 'mri': return <Brain className="w-4 h-4" />
      case 'ct-scan': return <Eye className="w-4 h-4" />
      case 'ecg': return <Heart className="w-4 h-4" />
      case 'ultrasound': return <Eye className="w-4 h-4" />
      case 'pathology': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: MedicalReport['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200'
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-3 hover:opacity-80 transition-smooth"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                  <User className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight">Patient Dashboard</span>
                  <div className="text-xs text-muted-foreground hidden sm:block">Health Overview</div>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/patient/assistant')}
                className="bg-accent hover:bg-accent/90 text-white h-9 px-4 text-sm font-medium shadow-elevated"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                AI Assistant
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Welcome back, Sarah
            </h1>
            <p className="text-muted-foreground">
              Here's your health overview and recent medical reports
            </p>
          </div>

          {/* Health Summary Card */}
          {healthSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Health Summary
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last updated: {formatDate(healthSummary.lastUpdated)}
                      </p>
                    </div>
                    <Badge className={getHealthStatusColor(healthSummary.overallHealth)}>
                      {healthSummary.overallHealth.charAt(0).toUpperCase() + healthSummary.overallHealth.slice(1)} Health
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{healthSummary.totalReports}</div>
                      <div className="text-sm text-muted-foreground">Total Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{healthSummary.normalReports}</div>
                      <div className="text-sm text-muted-foreground">Normal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{healthSummary.abnormalReports}</div>
                      <div className="text-sm text-muted-foreground">Abnormal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{healthSummary.criticalReports}</div>
                      <div className="text-sm text-muted-foreground">Critical</div>
                    </div>
                  </div>

                  {/* Health Trends */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Health Trends</h4>
                    <div className="space-y-2">
                      {healthSummary.healthTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium">{trend.category}</div>
                            <div className="text-sm text-muted-foreground">{trend.description}</div>
                          </div>
                          <Badge variant={trend.status === 'improving' ? 'default' : trend.status === 'declining' ? 'destructive' : 'secondary'}>
                            {trend.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => router.push('/patient/assistant')}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload New Report
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/patient/history')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View History
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/patient/select-language?mode=assistant')}
                      className="flex items-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      AI Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Critical Alerts */}
          {criticalReports.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-red-800 dark:text-red-200">
                        {criticalReports.length} Critical Report{criticalReports.length > 1 ? 's' : ''} Require Attention
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-300">
                        {criticalReports[0].title} - {formatDate(criticalReports[0].date)}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                      <div className="text-sm text-muted-foreground">Upcoming Appointments</div>
                    </div>
                    <Calendar className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  {upcomingAppointments.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium">{upcomingAppointments[0].specialty}</div>
                      <div className="text-muted-foreground">{formatDate(upcomingAppointments[0].date)}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{recentReports.length}</div>
                      <div className="text-sm text-muted-foreground">Recent Reports</div>
                    </div>
                    <FileText className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  {recentReports.length > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium">{recentReports[0].type.replace('-', ' ').toUpperCase()}</div>
                      <div className="text-muted-foreground">{formatDate(recentReports[0].date)}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {healthSummary?.medications.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Active Medications</div>
                    </div>
                    <Pill className="w-8 h-8 text-primary opacity-20" />
                  </div>
                  {(healthSummary?.medications.length || 0) > 0 && (
                    <div className="mt-3 text-sm">
                      <div className="font-medium">{healthSummary?.medications[0].name}</div>
                      <div className="text-muted-foreground">{healthSummary?.medications[0].dosage}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Reports Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Medical Reports
                    </CardTitle>
                    <Button 
                      onClick={() => router.push('/patient/assistant')}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="blood-test">Blood Test</option>
                      <option value="x-ray">X-Ray</option>
                      <option value="mri">MRI</option>
                      <option value="ct-scan">CT Scan</option>
                      <option value="ecg">ECG</option>
                      <option value="ultrasound">Ultrasound</option>
                      <option value="pathology">Pathology</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="normal">Normal</option>
                      <option value="abnormal">Abnormal</option>
                      <option value="critical">Critical</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Reports List */}
                  <div className="space-y-3">
                    {filteredReports.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No reports found</p>
                        <Button 
                          onClick={() => router.push('/patient/assistant')}
                          className="mt-3"
                        >
                          Upload Your First Report
                        </Button>
                      </div>
                    ) : (
                      filteredReports.map((report) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                          onClick={() => router.push(`/patient/reports/${report.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getReportTypeIcon(report.type)}
                                <h4 className="font-semibold">{report.title}</h4>
                                <Badge className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                {report.doctor} • {report.hospital}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(report.date)}
                              </div>
                              {report.keyFindings.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium">Key Findings:</div>
                                  <div className="text-sm text-muted-foreground">
                                    {report.keyFindings.slice(0, 2).join(', ')}
                                    {report.keyFindings.length > 2 && '...'}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                      <Button 
                        onClick={() => router.push('/patient/assistant')}
                        size="sm"
                        className="mt-2"
                      >
                        Schedule Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="p-3 border border-border rounded-lg">
                          <div className="font-medium">{appointment.specialty}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(appointment.date)} at {appointment.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Health Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Health Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Stay Hydrated
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        Drink at least 8 glasses of water daily for optimal health.
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Regular Exercise
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">
                        30 minutes of moderate activity most days of the week.
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="font-medium text-purple-800 dark:text-purple-200 mb-1">
                        Sleep Well
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-300">
                        Aim for 7-9 hours of quality sleep each night.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
