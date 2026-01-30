import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

export async function generateChatCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  options?: {
    temperature?: number
    maxTokens?: number
    stream?: boolean
  }
) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: options?.maxTokens || 4096,
    temperature: options?.temperature || 0.7,
    system: systemPrompt,
    messages,
    stream: options?.stream || false,
  })

  return response
}

export async function generateStreamingCompletion(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  options?: {
    temperature?: number
    maxTokens?: number
  }
) {
  const stream = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: options?.maxTokens || 4096,
    temperature: options?.temperature || 0.7,
    system: systemPrompt,
    messages,
    stream: true,
  })

  return stream
}

export async function extractStructuredData<T>(
  text: string,
  schema: string,
  instructions: string
): Promise<T> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: `${instructions}\n\nSchema:\n${schema}\n\nText to extract from:\n${text}\n\nReturn only valid JSON matching the schema.`,
      },
    ],
  })

  const content = response.content[0]
  if (content.type === 'text') {
    // Extract JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  }

  throw new Error('Failed to extract structured data')
}
