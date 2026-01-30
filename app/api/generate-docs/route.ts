import { NextRequest, NextResponse } from 'next/server'
import { generateChatCompletion } from '@/lib/groq' // Using FREE Groq instead!
import { POST_CONSULTATION_PROMPT } from '@/lib/medical-prompts'

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json()

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      )
    }

    // Generate documentation using Groq (FREE!)
    const response = await generateChatCompletion(
      [
        {
          role: 'system',
          content: POST_CONSULTATION_PROMPT,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      {
        temperature: 0.3,
        maxTokens: 4096,
        stream: false, // Ensure we get a completion, not a stream
      }
    )

    // Extract the generated documentation
    const content = response.choices[0]?.message?.content
    if (content) {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const documentation = JSON.parse(jsonMatch[0])
        return NextResponse.json(documentation)
      }
    }

    return NextResponse.json(
      { error: 'Failed to parse documentation' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Documentation generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate documentation' },
      { status: 500 }
    )
  }
}
