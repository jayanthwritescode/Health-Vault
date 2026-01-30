'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Activity,
  Filter,
  Search,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Heart,
  Pill,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock patient data - in real app, this would come from API/database
const mockPatients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    phone: '+1 234-567-8901',
    email: 'sarah.j@email.com',
    appointmentTime: '09:00 AM',
    urgencyLevel: 'routine',
    chiefComplaint: 'Persistent headaches and occasional dizziness',
    keyFindings: [
      'Headaches for 3 weeks, worsening in frequency',
      'No history of migraines',
      'Normal blood pressure readings at home',
      'Stressful work environment mentioned'
    ],
    medications: ['Ibuprofen 400mg PRN'],
    allergies: ['Penicillin'],
    pastMedicalHistory: ['Hypertension (controlled)'],
    redFlags: [],
    completionPercentage: 85,
    lastUpdated: '2024-01-30T08:30:00Z'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 62,
    gender: 'Male',
    phone: '+1 234-567-8902',
    email: 'm.chen@email.com',
    appointmentTime: '10:30 AM',
    urgencyLevel: 'urgent',
    chiefComplaint: 'Chest pain and shortness of breath',
    keyFindings: [
      'Chest pain started 2 days ago',
      'Pain worsens with exertion',
      'History of heart disease in family',
      'Smoker - 1 pack per day for 30 years'
    ],
    medications: ['Atorvastatin 40mg daily', 'Aspirin 81mg daily'],
    allergies: ['None known'],
    pastMedicalHistory: ['Type 2 Diabetes', 'Hyperlipidemia'],
    redFlags: [
      'Chest pain with exertion - possible cardiac ischemia',
      'Multiple risk factors for coronary artery disease'
    ],
    completionPercentage: 92,
    lastUpdated: '2024-01-30T09:15:00Z'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 28,
    gender: 'Female',
    phone: '+1 234-567-8903',
    email: 'emma.r@email.com',
    appointmentTime: '02:00 PM',
    urgencyLevel: 'emergency',
    chiefComplaint: 'Severe abdominal pain and fever',
    keyFindings: [
      'Sudden onset of right lower quadrant pain',
      'Fever of 101.5°F',
      'Nausea and vomiting',
      'Pain worsens with movement'
    ],
    medications: ['None currently'],
    allergies: ['Sulfa drugs'],
    pastMedicalHistory: ['Appendectomy 2018'],
    redFlags: [
      'Acute abdomen - possible appendicitis or other surgical emergency',
      'High fever with severe abdominal pain'
    ],
    completionPercentage: 78,
    lastUpdated: '2024-01-30T07:45:00Z'
  }
]

export default function DoctorPreConsultationPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('all')
  const [patients, setPatients] = useState(mockPatients)

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUrgency = filterUrgency === 'all' || patient.urgencyLevel === filterUrgency
    return matchesSearch && matchesUrgency
  })

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'destructive'
      case 'urgent': return 'default'
      case 'routine': return 'secondary'
      default: return 'outline'
    }
  }

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'emergency': return <AlertTriangle className="w-4 h-4" />
      case 'urgent': return <Clock className="w-4 h-4" />
      case 'routine': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const startConsultation = (patientId: string) => {
    // Navigate to documentation page with patient context
    router.push(`/doctor/documentation?patient=${patientId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                <h1 className="text-xl font-bold">Pre-Consultation Review</h1>
                <p className="text-sm text-muted-foreground">
                  Review patient histories before appointments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {patients.length} Patients
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {patients.filter(p => p.urgencyLevel === 'emergency').length} Emergency
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Today's Patients
                </CardTitle>
                <CardDescription>
                  Select a patient to review their history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                  >
                    <option value="all">All Urgency Levels</option>
                    <option value="emergency">Emergency</option>
                    <option value="urgent">Urgent</option>
                    <option value="routine">Routine</option>
                  </select>
                </div>

                {/* Patient Cards */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedPatient.id === patient.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{patient.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {patient.age}y • {patient.gender}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={getUrgencyColor(patient.urgencyLevel)} className="text-xs">
                                  {getUrgencyIcon(patient.urgencyLevel)}
                                  <span className="ml-1">{patient.urgencyLevel}</span>
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {patient.appointmentTime}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient && (
              <motion.div
                key={selectedPatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          {selectedPatient.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedPatient.age} years • {selectedPatient.gender}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getUrgencyColor(selectedPatient.urgencyLevel)}>
                          {getUrgencyIcon(selectedPatient.urgencyLevel)}
                          <span className="ml-1">{selectedPatient.urgencyLevel}</span>
                        </Badge>
                        <Button
                          onClick={() => startConsultation(selectedPatient.id)}
                          className="flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Start Consultation
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="risks">Risks</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        {/* Chief Complaint */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Chief Complaint
                          </h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {selectedPatient.chiefComplaint}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedPatient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedPatient.email}</span>
                          </div>
                        </div>

                        {/* Key Findings */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Key Findings
                          </h4>
                          <ul className="space-y-1">
                            {selectedPatient.keyFindings.map((finding, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="history" className="space-y-4">
                        {/* Medications */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Pill className="w-4 h-4" />
                            Current Medications
                          </h4>
                          <div className="space-y-1">
                            {selectedPatient.medications.map((med, idx) => (
                              <div key={idx} className="text-sm bg-muted/50 p-2 rounded">
                                {med}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Allergies */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Allergies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPatient.allergies.map((allergy, idx) => (
                              <Badge key={idx} variant="destructive">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Past Medical History */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            Past Medical History
                          </h4>
                          <div className="space-y-1">
                            {selectedPatient.pastMedicalHistory.map((condition, idx) => (
                              <div key={idx} className="text-sm bg-muted/50 p-2 rounded">
                                {condition}
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="risks" className="space-y-4">
                        {/* Red Flags */}
                        {selectedPatient.redFlags.length > 0 ? (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                              <AlertTriangle className="w-4 h-4 inline mr-2" />
                              Red Flags
                            </h4>
                            <ul className="space-y-1">
                              {selectedPatient.redFlags.map((flag, idx) => (
                                <li key={idx} className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2">
                                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  {flag}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                              <CheckCircle className="w-4 h-4 inline mr-2" />
                              No Red Flags Identified
                            </h4>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Patient history does not indicate immediate concerns requiring urgent attention.
                            </p>
                          </div>
                        )}

                        {/* Risk Assessment */}
                        <div>
                          <h4 className="font-semibold mb-2">Risk Assessment</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>History Completion</span>
                              <span>{selectedPatient.completionPercentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  selectedPatient.completionPercentage >= 80
                                    ? 'bg-green-500'
                                    : selectedPatient.completionPercentage >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${selectedPatient.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="actions" className="space-y-4">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            onClick={() => startConsultation(selectedPatient.id)}
                            className="flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            Begin Consultation
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            View Full History
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact Patient
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Send Reminder
                          </Button>
                        </div>

                        {/* Notes */}
                        <div>
                          <h4 className="font-semibold mb-2">Pre-Consultation Notes</h4>
                          <textarea
                            placeholder="Add notes for this consultation..."
                            className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
                            defaultValue=""
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
