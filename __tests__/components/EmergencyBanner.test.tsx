import { render, screen, fireEvent } from '@testing-library/react'
import { EmergencyBanner } from '@/components/medical/EmergencyBanner'

describe('EmergencyBanner', () => {
  it('renders when isVisible is true', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="warning"
      />
    )

    expect(screen.getByText('WARNING')).toBeInTheDocument()
    expect(screen.getByText('Seek Medical Attention')).toBeInTheDocument()
  })

  it('does not render when isVisible is false', () => {
    render(
      <EmergencyBanner 
        isVisible={false}
      />
    )

    expect(screen.queryByText('WARNING')).not.toBeInTheDocument()
  })

  it('renders critical emergency type correctly', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="critical"
      />
    )

    expect(screen.getByText('CRITICAL')).toBeInTheDocument()
    expect(screen.getByText('Medical Emergency')).toBeInTheDocument()
  })

  it('renders info emergency type correctly', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="info"
      />
    )

    expect(screen.getByText('IMPORTANT')).toBeInTheDocument()
    expect(screen.getByText('Health Advisory')).toBeInTheDocument()
  })

  it('displays custom message', () => {
    const customMessage = 'This is a custom emergency message'
    render(
      <EmergencyBanner 
        isVisible={true}
        message={customMessage}
      />
    )

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('shows call button when showCallButton is true', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
        showCallButton={true}
        phoneNumber="911"
      />
    )

    expect(screen.getByText('Call Emergency 911')).toBeInTheDocument()
  })

  it('uses custom phone number', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
        showCallButton={true}
        phoneNumber="108"
      />
    )

    expect(screen.getByText('Call Emergency 108')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn()
    render(
      <EmergencyBanner 
        isVisible={true}
        onDismiss={onDismiss}
      />
    )

    const dismissButton = screen.getByRole('button')
    fireEvent.click(dismissButton)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not show dismiss button when onDismiss is not provided', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
      />
    )

    // Should not have a dismiss button
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument()
  })

  it('renders find nearest hospital button', () => {
    render(
      <EmergencyBanner 
        isVisible={true}
      />
    )

    expect(screen.getByText('Find Nearest Hospital')).toBeInTheDocument()
  })

  it('applies correct styling for warning type', () => {
    const { container } = render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="warning"
      />
    )

    const banner = container.querySelector('.bg-orange-50')
    expect(banner).toBeInTheDocument()
  })

  it('applies correct styling for critical type', () => {
    const { container } = render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="critical"
      />
    )

    const banner = container.querySelector('.bg-red-50')
    expect(banner).toBeInTheDocument()
  })

  it('applies correct styling for info type', () => {
    const { container } = render(
      <EmergencyBanner 
        isVisible={true}
        emergencyType="info"
      />
    )

    const banner = container.querySelector('.bg-blue-50')
    expect(banner).toBeInTheDocument()
  })
})
