"use client"

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAudioStore } from '@/lib/store'
import { formatTime } from '@/lib/utils'

interface AudioRecorderProps {
  onTranscriptComplete: (transcript: string) => void
}

export function AudioRecorder({ onTranscriptComplete }: AudioRecorderProps) {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      toast({
        title: 'Recording Started',
        description: 'Speak clearly into your microphone',
      })
    } catch (error) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to record audio',
        variant: 'destructive',
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Transcription failed')

      const data = await response.json()
      onTranscriptComplete(data.transcript)

      toast({
        title: 'Transcription Complete',
        description: 'Your audio has been transcribed successfully',
      })
    } catch (error) {
      toast({
        title: 'Transcription Failed',
        description: 'Failed to transcribe audio. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an audio file',
        variant: 'destructive',
      })
      return
    }

    await transcribeAudio(file)
  }

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {/* Waveform Animation */}
          {isRecording && (
            <div className="flex items-center gap-2 h-20">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-medical rounded-full wave-bar"
                  style={{
                    height: `${20 + Math.random() * 60}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Timer */}
          {isRecording && (
            <div className="text-4xl font-bold gradient-text">
              {formatTime(duration)}
            </div>
          )}

          {/* Recording Button */}
          <Button
            size="lg"
            variant={isRecording ? 'destructive' : 'medical'}
            className="w-32 h-32 rounded-full"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
          >
            {isRecording ? (
              <Square className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </Button>

          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Click to stop recording' : 'Click to start recording'}
          </p>
        </div>
      </Card>

      {/* Upload Option */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">Or upload an existing audio file</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isTranscribing || isRecording}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Audio File
        </Button>
      </div>

      {/* Transcribing State */}
      {isTranscribing && (
        <Card className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="font-medium">Transcribing audio...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a moment depending on the audio length
          </p>
        </Card>
      )}
    </div>
  )
}
