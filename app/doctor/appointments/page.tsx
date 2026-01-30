'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { useAppointmentStore } from '@/lib/appointments-store'

export default function DoctorAppointmentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'in-person' | 'video' | 'phone'>('all')
  
  const {
    getUpcomingAppointments,
    getPastAppointments,
    getTodayAppointments,
    updateAppointment,
    cancelAppointment,
  } = useAppointmentStore()

  const upcomingAppointments = getUpcomingAppointments()
  const pastAppointments = getPastAppointments()
  const todayAppointments = getTodayAppointments()

  const filterAppointments = (appointments: any[]) => {
    let filtered = appointments

    if (filterType !== 'all') {
      filtered = filtered.filter(apt => apt.type === filterType)
    }

    if (searchQuery) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'no-show':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      case 'in-person':
        return <MapPin className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const AppointmentCard = ({ appointment, showActions = true }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{appointment.reason}</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              {getTypeIcon(appointment.type)}
              <span className="text-xs capitalize">{appointment.type}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="mb-3 p-2 bg-muted rounded text-sm">
              <p className="text-muted-foreground">{appointment.notes}</p>
            </div>
          )}

          {showActions && appointment.status === 'scheduled' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => updateAppointment(appointment.id, { status: 'confirmed' })}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/doctor/consultation?appointmentId=${appointment.id}`)}
              >
                Start Consultation
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => cancelAppointment(appointment.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          )}

          {showActions && appointment.status === 'confirmed' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/doctor/consultation?appointmentId=${appointment.id}`)}
              >
                Start Consultation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateAppointment(appointment.id, { status: 'completed' })}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Complete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="glass border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Appointments</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your schedule and patient appointments
                </p>
              </div>
            </div>
            <Button onClick={() => router.push('/doctor/consultation')}>
              <Plus className="w-4 h-4 mr-2" />
              New Consultation
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Today's Appointments Summary */}
        {todayAppointments.length > 0 && (
          <Card className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                You have {todayAppointments.length} appointment(s) scheduled for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{formatTime(apt.time).split(' ')[0]}</div>
                        <div className="text-xs text-muted-foreground">{formatTime(apt.time).split(' ')[1]}</div>
                      </div>
                      <div>
                        <p className="font-semibold">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(apt.status)}>{apt.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Types</option>
            <option value="in-person">In-Person</option>
            <option value="video">Video Call</option>
            <option value="phone">Phone Call</option>
          </select>
        </div>

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="upcoming">
              Upcoming ({filterAppointments(upcomingAppointments).length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({filterAppointments(pastAppointments).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filterAppointments(upcomingAppointments).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                  <p className="text-muted-foreground">
                    You don't have any scheduled appointments at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filterAppointments(upcomingAppointments).map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {filterAppointments(pastAppointments).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Past Appointments</h3>
                  <p className="text-muted-foreground">
                    Your appointment history will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filterAppointments(pastAppointments).map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
