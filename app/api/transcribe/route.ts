import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Transcribe using Groq Whisper
    const transcript = await transcribeAudio(audioFile, {
      language: 'en',
      prompt: 'This is a medical consultation between a doctor and patient.',
    })

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}
