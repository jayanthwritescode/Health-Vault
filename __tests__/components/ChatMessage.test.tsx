import { render, screen } from '@testing-library/react'
import { ChatMessage } from '@/components/chat/ChatMessage'

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const userMessage = {
      role: 'user' as const,
      content: 'Hello, I need help with my medication',
      timestamp: new Date()
    }

    render(<ChatMessage message={userMessage} />)

    expect(screen.getByText('Hello, I need help with my medication')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // User icon
  })

  it('renders assistant message correctly', () => {
    const assistantMessage = {
      role: 'assistant' as const,
      content: 'I can help you with your medication questions.',
      timestamp: new Date()
    }

    render(<ChatMessage message={assistantMessage} />)

    expect(screen.getByText('I can help you with your medication questions.')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Bot icon
  })

  it('renders system message correctly', () => {
    const systemMessage = {
      role: 'system' as const,
      content: 'System maintenance in progress',
      timestamp: new Date()
    }

    render(<ChatMessage message={systemMessage} />)

    expect(screen.getByText('System maintenance in progress')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Alert icon
  })

  it('shows typing indicator when isTyping is true', () => {
    const message = {
      role: 'assistant' as const,
      content: '',
      timestamp: new Date()
    }

    render(<ChatMessage message={message} isTyping={true} />)

    // Check for typing dots (animated elements)
    const typingDots = screen.getAllByRole('img', { hidden: true })
    expect(typingDots.length).toBeGreaterThan(0)
  })

  it('applies correct styling for user messages', () => {
    const userMessage = {
      role: 'user' as const,
      content: 'Test message',
      timestamp: new Date()
    }

    const { container } = render(<ChatMessage message={userMessage} />)

    const messageContainer = container.querySelector('.bg-accent')
    expect(messageContainer).toBeInTheDocument()
  })

  it('applies correct styling for assistant messages', () => {
    const assistantMessage = {
      role: 'assistant' as const,
      content: 'Test message',
      timestamp: new Date()
    }

    const { container } = render(<ChatMessage message={assistantMessage} />)

    const messageContainer = container.querySelector('.bg-card')
    expect(messageContainer).toBeInTheDocument()
  })

  it('handles empty content gracefully', () => {
    const message = {
      role: 'user' as const,
      content: '',
      timestamp: new Date()
    }

    render(<ChatMessage message={message} />)
    
    // Should not crash and should render the message structure
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it('handles long messages with line breaks', () => {
    const longMessage = {
      role: 'assistant' as const,
      content: 'This is a long message\nwith multiple lines\nand line breaks.',
      timestamp: new Date()
    }

    render(<ChatMessage message={longMessage} />)

    expect(screen.getByText(/This is a long message/)).toBeInTheDocument()
    expect(screen.getByText(/with multiple lines/)).toBeInTheDocument()
    expect(screen.getByText(/and line breaks/)).toBeInTheDocument()
  })
})
