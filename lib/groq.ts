import Groq from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  console.warn('Missing GROQ_API_KEY environment variable - transcription will not work')
}

export const groq = process.env.GROQ_API_KEY
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null

export const WHISPER_MODEL = 'whisper-large-v3'
export const LLM_MODEL = 'llama-3.3-70b-versatile' // Latest Llama 3.3 - Free and fast!

export async function transcribeAudio(
  audioFile: File | Blob,
  options?: {
    language?: string
    prompt?: string
    temperature?: number
  }
): Promise<string> {
  if (!groq) {
    throw new Error('Groq API key not configured')
  }

  const formData = new FormData()
  formData.append('file', audioFile)
  formData.append('model', WHISPER_MODEL)
  
  if (options?.language) {
    formData.append('language', options.language)
  }
  
  if (options?.prompt) {
    formData.append('prompt', options.prompt)
  }
  
  if (options?.temperature !== undefined) {
    formData.append('temperature', options.temperature.toString())
  }

  const response = await groq.audio.transcriptions.create({
    file: audioFile as File,
    model: WHISPER_MODEL,
    language: options?.language,
    prompt: options?.prompt,
    temperature: options?.temperature || 0,
    response_format: 'verbose_json',
  })

  return response.text
}

export async function transcribeAudioWithTimestamps(
  audioFile: File | Blob,
  options?: {
    language?: string
    prompt?: string
  }
): Promise<{
  text: string
  segments: Array<{
    start: number
    end: number
    text: string
  }>
}> {
  if (!groq) {
    throw new Error('Groq API key not configured')
  }

  const response = await groq.audio.transcriptions.create({
    file: audioFile as File,
    model: WHISPER_MODEL,
    language: options?.language,
    prompt: options?.prompt,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  return {
    text: response.text,
    segments: (response as any).segments || [],
  }
}

// Chat completion using Groq's LLM (FREE!)
export async function generateChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }
) {
  if (!groq) {
    throw new Error('Groq API key not configured')
  }

  const response = await groq.chat.completions.create({
    model: LLM_MODEL,
    messages,
    temperature: options?.temperature || 0.7,
    max_tokens: options?.maxTokens || 4096,
    stream: options?.stream || false,
  })

  return response as any // Type assertion to handle union type
}

// Streaming chat completion
export async function generateStreamingCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: {
    temperature?: number
    maxTokens?: number
  }
) {
  if (!groq) {
    throw new Error('Groq API key not configured')
  }

  const stream = await groq.chat.completions.create({
    model: LLM_MODEL,
    messages,
    temperature: options?.temperature || 0.7,
    max_tokens: options?.maxTokens || 4096,
    stream: true,
  })

  return stream
}
