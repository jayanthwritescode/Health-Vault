'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Calendar,
  Users,
  Activity,
  Clock,
  ArrowRight,
  Stethoscope,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppointmentStore } from '@/lib/appointments-store'
import { usePatientStore } from '@/lib/patients-store'

export default function DoctorDashboardPage() {
  const router = useRouter()
  const { getTodayAppointments, getUpcomingAppointments } = useAppointmentStore()
  const { getActivePatients, getRecentPatients } = usePatientStore()

  const todayAppointments = getTodayAppointments()
  const upcomingAppointments = getUpcomingAppointments()
  const activePatients = getActivePatients()
  const recentPatients = getRecentPatients(3)

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-3 hover:opacity-80 transition-smooth"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight">MedScribe AI</span>
                  <div className="text-xs text-muted-foreground hidden sm:block">Clinical Dashboard</div>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/doctor/consultation')}
                className="bg-accent hover:bg-accent/90 text-white h-9 px-4 text-sm font-medium shadow-elevated"
              >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                New Consultation
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
              Good morning, Dr. Patel
            </h1>
            <p className="text-muted-foreground">
              {todayAppointments.length > 0 
                ? `You have ${todayAppointments.length} consultation${todayAppointments.length > 1 ? 's' : ''} scheduled today`
                : 'No consultations scheduled for today'}
            </p>
          </div>

          {/* Stats Overview - Inline, not boxes */}
          <div className="flex flex-wrap gap-x-12 gap-y-6 mb-12 pb-8 border-b border-border">
            <div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">
                {todayAppointments.length}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                Today's appointments
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">
                {activePatients.length}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" strokeWidth={1.5} />
                Active patients
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">
                {upcomingAppointments.length}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" strokeWidth={1.5} />
                Upcoming this week
              </div>
            </div>
          </div>

          {/* Today's Schedule - Prominent if exists */}
          {todayAppointments.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Today's Schedule
                </h2>
                <button 
                  onClick={() => router.push('/doctor/appointments')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  View all appointments →
                </button>
              </div>
              
              <div className="space-y-3">
                {todayAppointments.slice(0, 4).map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => router.push(`/doctor/consultation?appointmentId=${apt.id}`)}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth cursor-pointer shadow-clinical hover:shadow-elevated"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[70px]">
                          <div className="text-xl font-display font-bold text-foreground">
                            {formatTime(apt.time).split(' ')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(apt.time).split(' ')[1]}
                          </div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div>
                          <p className="font-semibold text-base mb-1">{apt.patientName}</p>
                          <p className="text-sm text-muted-foreground">{apt.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {apt.status}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions - Bento Style */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold tracking-tight mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Consultation - Larger */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push('/doctor/consultation')}
                className="md:col-span-2 bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-smooth cursor-pointer shadow-clinical hover:shadow-elevated group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Consultation & Documentation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Record consultations and generate SOAP notes, prescriptions, and ICD-10 codes automatically
                </p>
                <div className="text-sm text-primary font-medium">
                  {todayAppointments.length} scheduled today
                </div>
              </motion.div>

              {/* Appointments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => router.push('/doctor/appointments')}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-smooth cursor-pointer shadow-clinical hover:shadow-elevated group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-md bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Appointments
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your schedule and upcoming consultations
                </p>
                <div className="text-sm text-secondary font-medium">
                  {upcomingAppointments.length} upcoming
                </div>
              </motion.div>

              {/* Patients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => router.push('/doctor/patients')}
                className="md:col-span-3 bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-smooth cursor-pointer shadow-clinical hover:shadow-elevated group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold mb-1">
                        Patient Records
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage registered patients and their medical history
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold text-accent">
                        {activePatients.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Active patients</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Recent Patients */}
          {recentPatients.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Recent Patients
                </h2>
                <button 
                  onClick={() => router.push('/doctor/patients')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
                >
                  View all patients →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentPatients.map((patient, idx) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth cursor-pointer shadow-clinical hover:shadow-elevated"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last updated recently</span>
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
