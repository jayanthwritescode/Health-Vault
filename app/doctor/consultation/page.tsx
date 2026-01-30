"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mic,
  Upload,
  FileText,
  Download,
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { AudioRecorder } from '@/components/audio/audio-recorder'
import { TranscriptEditor } from '@/components/medical/transcript-editor'
import { DocumentationOutput } from '@/components/medical/documentation-output'
import { useDocumentationStore } from '@/lib/store'

export default function DocumentationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('record')
  const [isGenerating, setIsGenerating] = useState(false)
  const [documentation, setDocumentation] = useState<any>(null)
  const { currentTranscript, setCurrentTranscript } = useDocumentationStore()

  const handleTranscriptComplete = (transcript: string) => {
    setCurrentTranscript(transcript)
    setActiveTab('review')
    toast({
      title: 'Transcription Complete',
      description: 'Review and edit the transcript before generating documentation.',
    })
  }

  const handleGenerateDocumentation = async () => {
    if (!currentTranscript) {
      toast({
        title: 'No Transcript',
        description: 'Please record or upload audio first.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: currentTranscript }),
      })

      if (!response.ok) throw new Error('Failed to generate documentation')

      const data = await response.json()
      setDocumentation(data)
      setActiveTab('documentation')
      
      toast({
        title: 'Documentation Generated',
        description: 'Your SOAP notes and codes are ready for review.',
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate documentation. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/doctor')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Consultation & Documentation</h1>
                <p className="text-sm text-muted-foreground">Generate SOAP notes and medical codes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                HIPAA Compliant
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            <TabsTrigger value="record" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Record/Upload
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2" disabled={!currentTranscript}>
              <FileText className="w-4 h-4" />
              Review Transcript
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-2" disabled={!documentation}>
              <Sparkles className="w-4 h-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          {/* Record/Upload Tab */}
          <TabsContent value="record" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle>Record Consultation</CardTitle>
                  <CardDescription>
                    Record your consultation in real-time or upload an existing audio file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AudioRecorder onTranscriptComplete={handleTranscriptComplete} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Review Transcript Tab */}
          <TabsContent value="review" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle>Review & Edit Transcript</CardTitle>
                  <CardDescription>
                    Review the transcription and make any necessary corrections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TranscriptEditor
                    transcript={currentTranscript}
                    onChange={setCurrentTranscript}
                  />
                  <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setActiveTab('record')}>
                      Back to Recording
                    </Button>
                    <Button 
                      variant="medical" 
                      onClick={handleGenerateDocumentation}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Documentation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {documentation && (
                <DocumentationOutput documentation={documentation} />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
