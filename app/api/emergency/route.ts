import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      patientId, 
      patientName, 
      patientPhone, 
      emergencyType, 
      symptoms, 
      severity, 
      location, 
      healthSummary 
    } = body

    // Validate required fields
    if (!patientId || !patientName || !symptoms || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log the emergency alert (in production, this would trigger actual notifications)
    console.log('🚨 EMERGENCY ALERT RECEIVED:', {
      timestamp: new Date().toISOString(),
      patientId,
      patientName,
      patientPhone,
      emergencyType,
      severity,
      symptoms,
      location,
      healthSummary
    })

    // Simulate doctor notification
    const availableDoctors = [
      { name: 'Dr. Sarah Johnson', specialty: 'Emergency Medicine', phone: '+1-555-0123' },
      { name: 'Dr. Michael Chen', specialty: 'Cardiology', phone: '+1-555-0124' },
      { name: 'Dr. James Wilson', specialty: 'Neurology', phone: '+1-555-0126' }
    ]

    // For critical emergencies, notify all available doctors
    if (emergencyType === 'critical') {
      console.log('🚑 CRITICAL EMERGENCY - Notifying all available doctors:')
      availableDoctors.forEach(doctor => {
        console.log(`  → ${doctor.name} (${doctor.specialty}): ${doctor.phone}`)
      })
    } else {
      // For less severe cases, notify the first available doctor
      const assignedDoctor = availableDoctors[0]
      console.log(`📱 Emergency alert sent to: ${assignedDoctor.name} (${assignedDoctor.specialty})`)
    }

    // Simulate notification delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
      alertId: `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assignedDoctor: emergencyType === 'critical' ? 'Multiple doctors notified' : availableDoctors[0].name,
      estimatedResponseTime: emergencyType === 'critical' ? '2-5 minutes' : '5-15 minutes'
    })

  } catch (error) {
    console.error('Emergency alert error:', error)
    return NextResponse.json(
      { error: 'Failed to process emergency alert' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get active emergency alerts (for doctor dashboard)
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')

    if (doctorId) {
      // Return alerts assigned to this doctor
      console.log(`📋 Fetching emergency alerts for doctor: ${doctorId}`)
    }

    return NextResponse.json({
      activeAlerts: [],
      message: 'No active emergency alerts'
    })

  } catch (error) {
    console.error('Error fetching emergency alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency alerts' },
      { status: 500 }
    )
  }
}
