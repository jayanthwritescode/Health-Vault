'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Play, Settings, Trash2, Users, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDemoMode, useDemoStore } from '@/lib/demo-store'

export function DemoModeToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode()
  const [showControls, setShowControls] = useState(false)
  const { patients, appointments, medicalReports, generateRandomData, clearAllData } = useDemoStore()

  const handleGenerateData = () => {
    generateRandomData(3)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all demo data?')) {
      clearAllData()
    }
  }

  if (!isDemoMode) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleDemoMode}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Enable Demo Mode
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Demo Mode Badge */}
      <div className="fixed top-4 right-4 z-50">
        <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Database className="w-3 h-3 mr-1" />
          Demo Mode Active
        </Badge>
      </div>

      {/* Demo Controls Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Demo Controls</CardTitle>
                <CardDescription className="text-xs">Manage demo data and settings</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowControls(!showControls)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          {showControls && (
            <CardContent className="space-y-3">
              {/* Data Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/50 rounded p-2">
                  <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{patients.length}</div>
                  <div className="text-xs text-muted-foreground">Patients</div>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{appointments.length}</div>
                  <div className="text-xs text-muted-foreground">Appointments</div>
                </div>
                <div className="bg-muted/50 rounded p-2">
                  <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <div className="text-lg font-bold">{medicalReports.length}</div>
                  <div className="text-xs text-muted-foreground">Reports</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateData}
                  className="w-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Generate Random Data
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearData}
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDemoMode}
                  className="w-full"
                >
                  Exit Demo Mode
                </Button>
              </div>

              {/* Demo Features */}
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">Demo Features:</div>
                <ul className="space-y-0.5">
                  <li>• Pre-populated patient data</li>
                  <li>• Sample medical reports</li>
                  <li>• Mock appointments</li>
                  <li>• Test conversations</li>
                </ul>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}
