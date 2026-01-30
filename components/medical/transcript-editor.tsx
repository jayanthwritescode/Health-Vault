"use client"

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface TranscriptEditorProps {
  transcript: string
  onChange: (transcript: string) => void
}

export function TranscriptEditor({ transcript, onChange }: TranscriptEditorProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="transcript">Consultation Transcript</Label>
      <Textarea
        id="transcript"
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcription will appear here..."
        className="min-h-[400px] font-mono text-sm"
      />
      <p className="text-sm text-muted-foreground">
        Review and edit the transcript before generating documentation. You can add or correct any details.
      </p>
    </div>
  )
}
