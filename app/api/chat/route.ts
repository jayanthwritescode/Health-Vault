import { NextRequest, NextResponse } from 'next/server'
import { generateStreamingCompletion } from '@/lib/groq' // Using FREE Groq instead!
import { PRE_CONSULTATION_PROMPT, PATIENT_ASSISTANT_PROMPT } from '@/lib/medical-prompts'

export async function POST(request: NextRequest) {
  try {
    const { messages, type = 'patient-assistant' } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Select appropriate prompt based on type
    const systemPrompt = type === 'pre-consultation' 
      ? PRE_CONSULTATION_PROMPT 
      : PATIENT_ASSISTANT_PROMPT

    // Add system prompt to messages
    const messagesWithSystem = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ]

    // Create streaming response
    const stream = await generateStreamingCompletion(
      messagesWithSystem,
      {
        temperature: 0.7,
        maxTokens: 2048,
      }
    )

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
