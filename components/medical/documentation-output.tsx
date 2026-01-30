"use client"

import { Download, Printer, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface DocumentationOutputProps {
  documentation: any
}

export function DocumentationOutput({ documentation }: DocumentationOutputProps) {
  const handleDownload = () => {
    // Implementation for PDF download
    console.log('Downloading documentation...')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // Implementation for email
    console.log('Emailing documentation...')
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      <Tabs defaultValue="soap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
          <TabsTrigger value="codes">ICD-10 / CPT</TabsTrigger>
          <TabsTrigger value="prescription">Prescription</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Claim</TabsTrigger>
          <TabsTrigger value="patient">Patient Education</TabsTrigger>
        </TabsList>

        {/* SOAP Notes */}
        <TabsContent value="soap">
          <Card>
            <CardHeader>
              <CardTitle>SOAP Notes</CardTitle>
              <CardDescription>Comprehensive clinical documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Subjective</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {documentation?.soapNotes?.subjective || 'No subjective data'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">Objective</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {documentation?.soapNotes?.objective || 'No objective data'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">Assessment</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {documentation?.soapNotes?.assessment || 'No assessment'}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-2">Plan</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {documentation?.soapNotes?.plan || 'No plan'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ICD-10 / CPT Codes */}
        <TabsContent value="codes">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ICD-10 Diagnosis Codes</CardTitle>
                <CardDescription>Suggested diagnosis codes with confidence scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentation?.icd10Codes?.map((code: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-muted">
                      <div className="flex-1">
                        <div className="font-semibold">{code.code}</div>
                        <div className="text-sm text-muted-foreground">{code.description}</div>
                      </div>
                      <Badge variant={code.confidence > 0.8 ? 'default' : 'secondary'}>
                        {Math.round(code.confidence * 100)}%
                      </Badge>
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No codes generated</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CPT Procedure Codes</CardTitle>
                <CardDescription>Billing codes for procedures performed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentation?.cptCodes?.map((code: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-muted">
                      <div className="flex-1">
                        <div className="font-semibold">{code.code}</div>
                        <div className="text-sm text-muted-foreground">{code.description}</div>
                      </div>
                      <Badge variant={code.confidence > 0.8 ? 'default' : 'secondary'}>
                        {Math.round(code.confidence * 100)}%
                      </Badge>
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No codes generated</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prescription */}
        <TabsContent value="prescription">
          <Card>
            <CardHeader>
              <CardTitle>Prescription</CardTitle>
              <CardDescription>Medications prescribed during consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentation?.prescription?.medications?.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {documentation.prescription.medications.map((med: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-lg bg-muted border">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{med.name}</h4>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                          </div>
                          <Badge>{med.route}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div>
                            <span className="font-medium">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {med.duration}
                          </div>
                        </div>
                        {med.instructions && (
                          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {documentation.prescription.pharmacistNotes && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm font-medium mb-1">Pharmacist Notes:</p>
                      <p className="text-sm">{documentation.prescription.pharmacistNotes}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No prescription generated</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Claim */}
        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Claim Summary</CardTitle>
              <CardDescription>Documentation for insurance claim submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentation?.insuranceClaim ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Claim Type</p>
                      <p className="font-semibold">{documentation.insuranceClaim.claimType || 'OPD'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Primary Diagnosis</p>
                      <p className="font-semibold">{documentation.insuranceClaim.diagnosis || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Clinical Summary</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {documentation.insuranceClaim.summary}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Treatment Justification</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {documentation.insuranceClaim.treatmentJustification}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {documentation.insuranceClaim.expectedDuration && (
                      <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-xs text-muted-foreground mb-1">Expected Duration</p>
                        <p className="font-semibold">{documentation.insuranceClaim.expectedDuration}</p>
                      </div>
                    )}
                    {documentation.insuranceClaim.estimatedCost && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <p className="text-xs text-muted-foreground mb-1">Estimated Cost</p>
                        <p className="font-semibold">₹{documentation.insuranceClaim.estimatedCost}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No insurance claim summary generated</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Education */}
        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient Education Summary</CardTitle>
              <CardDescription>Simple language explanation for the patient</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {documentation?.patientEducation || 'No patient education summary generated'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
