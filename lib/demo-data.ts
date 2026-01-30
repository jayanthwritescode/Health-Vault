// Demo data for testing and presentations

export const demoPatients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    email: 'sarah.johnson@email.com',
    phone: '+1 234-567-8901',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'John Johnson (Husband) - +1 234-567-8902',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: [
      'Hypertension (diagnosed 2018)',
      'Type 2 Diabetes (diagnosed 2020)',
      'Migraines (since age 25)'
    ],
    currentMedications: [
      'Lisinopril 10mg daily',
      'Metformin 500mg twice daily',
      'Sumatriptan 100mg PRN for migraines'
    ],
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-01',
    primaryDoctor: 'Dr. Emily Chen'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    age: 62,
    gender: 'Male',
    email: 'm.rodriguez@email.com',
    phone: '+1 234-567-8903',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    emergencyContact: 'Maria Rodriguez (Daughter) - +1 234-567-8904',
    bloodType: 'A+',
    allergies: ['None known'],
    medicalHistory: [
      'Coronary artery disease (diagnosed 2015)',
      'Hyperlipidemia (diagnosed 2014)',
      'Hypertension (diagnosed 2013)',
      'Knee replacement surgery (2019)'
    ],
    currentMedications: [
      'Atorvastatin 40mg daily',
      'Aspirin 81mg daily',
      'Metoprolol 50mg twice daily',
      'Lisinopril 20mg daily'
    ],
    lastVisit: '2024-01-10',
    nextAppointment: '2024-02-15',
    primaryDoctor: 'Dr. James Wilson'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    age: 28,
    gender: 'Female',
    email: 'emma.thompson@email.com',
    phone: '+1 234-567-8905',
    address: '789 Pine St, Chicago, IL 60601',
    emergencyContact: 'David Thompson (Father) - +1 234-567-8906',
    bloodType: 'B+',
    allergies: ['Sulfa drugs', 'Latex'],
    medicalHistory: [
      'Asthma (since childhood)',
      'Seasonal allergies',
      'Anxiety disorder (diagnosed 2021)'
    ],
    currentMedications: [
      'Albuterol inhaler PRN',
      'Fluticasone nasal spray daily',
      'Sertraline 50mg daily'
    ],
    lastVisit: '2024-01-20',
    nextAppointment: '2024-03-01',
    primaryDoctor: 'Dr. Sarah Patel'
  }
]

export const demoAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Internal Medicine',
    date: '2024-02-01',
    time: '09:00 AM',
    duration: 30,
    type: 'in-person',
    status: 'scheduled',
    reason: 'Diabetes follow-up and medication review',
    notes: 'Patient reports occasional dizziness with current medication'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Rodriguez',
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    date: '2024-02-15',
    time: '10:30 AM',
    duration: 45,
    type: 'video',
    status: 'scheduled',
    reason: 'Cardiac follow-up post-stent placement',
    notes: '6-month follow-up after coronary stent placement'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Emma Thompson',
    doctorName: 'Dr. Sarah Patel',
    specialty: 'Family Medicine',
    date: '2024-03-01',
    time: '02:00 PM',
    duration: 30,
    type: 'in-person',
    status: 'scheduled',
    reason: 'Annual physical examination',
    notes: 'Routine annual check-up and preventive care'
  }
]

export const demoMedicalReports = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    type: 'Blood Test',
    date: '2024-01-15',
    results: {
      'Glucose (Fasting)': {
        value: '95 mg/dL',
        range: '70-99 mg/dL',
        status: 'normal'
      },
      'Hemoglobin A1c': {
        value: '6.8%',
        range: '<5.7%',
        status: 'high'
      },
      'Total Cholesterol': {
        value: '185 mg/dL',
        range: '<200 mg/dL',
        status: 'normal'
      },
      'LDL Cholesterol': {
        value: '110 mg/dL',
        range: '<100 mg/dL',
        status: 'high'
      },
      'HDL Cholesterol': {
        value: '55 mg/dL',
        range: '>60 mg/dL',
        status: 'borderline'
      },
      'Triglycerides': {
        value: '145 mg/dL',
        range: '<150 mg/dL',
        status: 'normal'
      }
    },
    summary: 'Diabetes control needs improvement. Consider medication adjustment.',
    recommendations: [
      'Increase metformin dosage',
      'Dietary consultation',
      'Exercise program',
      'Follow-up in 3 months'
    ]
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Michael Rodriguez',
    type: 'ECG',
    date: '2024-01-10',
    results: {
      'Heart Rate': {
        value: '72 bpm',
        range: '60-100 bpm',
        status: 'normal'
      },
      'Rhythm': {
        value: 'Sinus rhythm',
        range: 'Sinus rhythm',
        status: 'normal'
      },
      'PR Interval': {
        value: '160 ms',
        range: '120-200 ms',
        status: 'normal'
      },
      'QRS Duration': {
        value: '90 ms',
        range: '80-120 ms',
        status: 'normal'
      },
      'QT Interval': {
        value: '420 ms',
        range: '<440 ms',
        status: 'normal'
      }
    },
    summary: 'Normal sinus rhythm. No acute ischemic changes.',
    recommendations: [
      'Continue current medications',
      'Regular cardiac monitoring',
      'Stress test in 6 months'
    ]
  }
]

export const demoConversations = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-01-25',
    type: 'pre-consultation',
    messages: [
      {
        role: 'assistant',
        content: 'Hello! I\'m here to help collect some information before your appointment. What brings you in today?',
        timestamp: '2024-01-25T09:00:00Z'
      },
      {
        role: 'user',
        content: 'I\'ve been feeling dizzy lately, especially when I stand up quickly.',
        timestamp: '2024-01-25T09:01:00Z'
      },
      {
        role: 'assistant',
        content: 'I understand that can be concerning. When did you start experiencing this dizziness?',
        timestamp: '2024-01-25T09:01:30Z'
      },
      {
        role: 'user',
        content: 'It started about 2 weeks ago. It happens mostly in the morning when I get out of bed.',
        timestamp: '2024-01-25T09:02:00Z'
      },
      {
        role: 'assistant',
        content: 'Have you noticed any other symptoms along with the dizziness, such as headache, blurred vision, or nausea?',
        timestamp: '2024-01-25T09:02:30Z'
      },
      {
        role: 'user',
        content: 'Sometimes I get a slight headache, but no blurred vision or nausea.',
        timestamp: '2024-01-25T09:03:00Z'
      }
    ],
    summary: {
      chiefComplaint: 'Dizziness upon standing for 2 weeks, worse in mornings',
      urgencyLevel: 'routine',
      redFlags: [],
      keyFindings: [
        'Dizziness started 2 weeks ago',
        'Worse in mornings when getting out of bed',
        'Occasional mild headaches',
        'No blurred vision or nausea'
      ]
    }
  }
]

export const demoDocumentation = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    doctorName: 'Dr. Emily Chen',
    date: '2024-01-15',
    type: 'SOAP Note',
    soap: {
      subjective: 'Patient presents for diabetes follow-up. Reports occasional dizziness when standing up quickly, started 2 weeks ago. No chest pain, shortness of breath, or vision changes. Takes medications as prescribed but sometimes forgets evening dose of metformin.',
      objective: 'BP: 128/82 mmHg, HR: 72 bpm, RR: 16/min, Temp: 98.6°F. Weight: 165 lbs (stable). Alert and oriented x3. Cardiovascular: Regular rhythm, no murmurs. Lungs clear bilaterally. No peripheral edema.',
      assessment: '1. Type 2 Diabetes Mellitus - suboptimal control (A1c 6.8%)\n2. Hypertension - well controlled\n3. Orthostatic hypotension - likely medication related',
      plan: '1. Increase metformin to 1000mg twice daily with meals\n2. Check orthostatic vitals\n3. Diabetes education reinforcement\n4. Follow up in 3 months for repeat labs\n5. Continue lisinopril 10mg daily'
    },
    prescriptions: [
      {
        medication: 'Metformin',
        dosage: '1000mg',
        frequency: 'Twice daily with meals',
        duration: '3 months',
        refills: 3
      },
      {
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '3 months',
        refills: 3
      }
    ],
    patientEducation: [
      'Take metformin with food to reduce stomach upset',
      'Monitor blood sugar regularly',
      'Stand up slowly to prevent dizziness',
      'Stay well hydrated',
      'Follow low-carbohydrate diet'
    ]
  }
]

export const demoSymptoms = [
  {
    id: '1',
    name: 'Chest Pain',
    description: 'Pain or discomfort in the chest area',
    urgencyLevel: 'emergency',
    redFlags: [
      'Chest pain radiating to arm/jaw',
      'Chest pain with sweating',
      'Chest pain with shortness of breath'
    ],
    questions: [
      'Can you describe the pain? (sharp, dull, pressure)',
      'Where exactly is the pain located?',
      'Does the pain radiate anywhere?',
      'What makes it better or worse?',
      'How long have you had this pain?'
    ],
    advice: {
      emergency: 'Call 911 immediately. This could be a heart attack.',
      urgent: 'Seek emergency medical care today.',
      routine: 'Schedule an appointment with your doctor.',
      selfCare: 'Try rest and over-the-counter pain relief. Monitor symptoms.'
    }
  },
  {
    id: '2',
    name: 'Headache',
    description: 'Pain in the head or neck region',
    urgencyLevel: 'routine',
    redFlags: [
      'Sudden severe headache ("thunderclap")',
      'Headache with fever and stiff neck',
      'Headache after head injury',
      'Headache with vision changes or weakness'
    ],
    questions: [
      'Where is the headache located?',
      'What does the pain feel like?',
      'How often do you get headaches?',
      'What triggers your headaches?',
      'What helps relieve the pain?'
    ],
    advice: {
      emergency: 'Go to emergency room immediately.',
      urgent: 'See a doctor today or tomorrow.',
      routine: 'Schedule an appointment if headaches persist.',
      selfCare: 'Try rest, hydration, and over-the-counter pain relievers.'
    }
  }
]

export const demoMedications = [
  {
    id: '1',
    name: 'Metformin',
    category: 'Oral Diabetes Medication',
    uses: [
      'Type 2 diabetes mellitus',
      'Prediabetes (off-label)',
      'PCOS (off-label)'
    ],
    dosage: 'Start 500mg once daily with evening meal, increase by 500mg weekly to max 2000mg/day',
    sideEffects: [
      'Common: Diarrhea, nausea, gas, stomach upset',
      'Rare: Lactic acidosis (serious)',
      'Usually improves with time'
    ],
    interactions: [
      'Contrast dye (hold metformin before/after procedures)',
      'Alcohol (increases lactic acidosis risk)',
      'Some diuretics'
    ],
    precautions: [
      'Take with food to reduce stomach upset',
      'Drink plenty of fluids',
      'Monitor kidney function regularly',
      'Avoid excessive alcohol'
    ],
    warnings: [
      'Do not use if kidney disease present',
      'Stop before surgery or imaging with contrast',
      'Seek immediate care for severe muscle pain'
    ]
  },
  {
    id: '2',
    name: 'Lisinopril',
    category: 'ACE Inhibitor',
    uses: [
      'Hypertension',
      'Heart failure',
      'Diabetic kidney disease',
      'Post-heart attack'
    ],
    dosage: 'Start 10mg once daily, adjust based on response (max 40mg/day)',
    sideEffects: [
      'Common: Dry cough, dizziness, headache',
      'Less common: Fatigue, nausea',
      'Rare: Angioedema (swelling of face/lips)'
    ],
    interactions: [
      'Potassium supplements (can increase potassium)',
      'NSAIDs (may reduce effectiveness)',
      'Diuretics (may cause low blood pressure)'
    ],
    precautions: [
      'Monitor blood pressure regularly',
      'Watch for swelling of face/lips',
      'Avoid potassium supplements unless prescribed',
      'Rise slowly from sitting/lying position'
    ],
    warnings: [
      'Can cause birth defects - avoid in pregnancy',
      'Stop immediately if angioedema occurs',
      'May cause kidney function changes'
    ]
  }
]

// Helper functions to generate random demo data
export const generateRandomPatient = () => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const age = Math.floor(Math.random() * 60) + 18
  const gender = Math.random() > 0.5 ? 'Male' : 'Female'
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstName} ${lastName}`,
    age,
    gender,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    bloodType: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
    allergies: Math.random() > 0.7 ? ['Penicillin'] : [],
    medicalHistory: [],
    currentMedications: []
  }
}

export const generateRandomAppointment = (patientId: string) => {
  const specialties = ['Internal Medicine', 'Cardiology', 'Family Medicine', 'Pediatrics', 'Dermatology']
  const doctors = ['Dr. Emily Chen', 'Dr. James Wilson', 'Dr. Sarah Patel', 'Dr. Michael Brown', 'Dr. Lisa Anderson']
  
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1)
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    patientId,
    doctorName: doctors[Math.floor(Math.random() * doctors.length)],
    specialty: specialties[Math.floor(Math.random() * specialties.length)],
    date: futureDate.toISOString().split('T')[0],
    time: `${Math.floor(Math.random() * 12) + 8}:${Math.random() > 0.5 ? '00' : '30'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    duration: 30,
    type: Math.random() > 0.5 ? 'in-person' : 'video',
    status: 'scheduled',
    reason: 'Routine check-up'
  }
}
