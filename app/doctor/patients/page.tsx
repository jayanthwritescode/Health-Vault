'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  Phone,
  Mail,
  Calendar,
  Activity,
  Filter,
  Download,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { usePatientStore } from '@/lib/patients-store'

export default function DoctorPatientsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showAddPatient, setShowAddPatient] = useState(false)
  
  const { patients, searchPatients, getActivePatients, addPatient } = usePatientStore()
  
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    bloodGroup: '',
    status: 'active' as 'active' | 'inactive',
    medicalHistory: {
      conditions: [] as string[],
      allergies: [] as string[],
      medications: [] as string[],
      surgeries: [] as string[]
    }
  })

  const filteredPatients = searchQuery
    ? searchPatients(searchQuery)
    : filterStatus === 'all'
    ? patients
    : filterStatus === 'active'
    ? getActivePatients()
    : patients.filter(p => p.status === 'inactive')

  const handleAddPatient = () => {
    if (!newPatient.name) {
      alert('Please enter patient name')
      return
    }

    addPatient(newPatient)
    setShowAddPatient(false)
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      bloodGroup: '',
      status: 'active',
      medicalHistory: {
        conditions: [],
        allergies: [],
        medications: [],
        surgeries: []
      }
    })
  }

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return `${age} years`
  }

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
                onClick={() => router.push('/doctor')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Patients</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your registered patients
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddPatient(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{getActivePatients().length}</div>
              <p className="text-sm text-muted-foreground">Active Patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {patients.filter(p => p.lastVisit && 
                  new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <p className="text-sm text-muted-foreground">Visited This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 rounded-lg border bg-background"
          >
            <option value="all">All Patients</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Add New Patient</CardTitle>
                  <CardDescription>Enter patient details to register</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phone</label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Date of Birth</label>
                      <Input
                        type="date"
                        value={newPatient.dateOfBirth}
                        onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Gender</label>
                      <select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as any})}
                        className="w-full px-3 py-2 rounded-md border bg-background"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Blood Group</label>
                      <Input
                        placeholder="A+"
                        value={newPatient.bloodGroup}
                        onChange={(e) => setNewPatient({...newPatient, bloodGroup: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddPatient} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Patient
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try a different search term' : 'Add your first patient to get started'}
              </p>
              <Button onClick={() => setShowAddPatient(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'Age N/A'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      {patient.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {patient.phone}
                        </div>
                      )}
                      {patient.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {patient.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        {patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}
                      </div>
                      {patient.lastVisit && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Last: {new Date(patient.lastVisit).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {patient.medicalHistory.conditions.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalHistory.conditions.slice(0, 2).map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                          {patient.medicalHistory.conditions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{patient.medicalHistory.conditions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
