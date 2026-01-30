import { NextRequest, NextResponse } from 'next/server'
import { generateChatCompletion } from '@/lib/groq'
import { GENERATE_SUMMARY_PROMPT } from '@/lib/medical-prompts'

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json()

    if (!conversation) {
      return NextResponse.json(
        { error: 'No conversation provided' },
        { status: 400 }
      )
    }

    // Generate summary using Groq
    const response = await generateChatCompletion(
      [
        {
          role: 'system',
          content: GENERATE_SUMMARY_PROMPT,
        },
        {
          role: 'user',
          content: conversation,
        },
      ],
      {
        temperature: 0.3,
        maxTokens: 2048,
      }
    )

    // Extract the generated summary
    const content = response.choices[0]?.message?.content
    if (content) {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const summaryData = JSON.parse(jsonMatch[0])
        // Return the patientSummary object directly
        return NextResponse.json({ 
          summary: summaryData.patientSummary || summaryData 
        })
      }
    }

    return NextResponse.json(
      { error: 'Failed to parse summary' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Summary generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
