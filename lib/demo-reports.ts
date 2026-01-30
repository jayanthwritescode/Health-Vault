import { MedicalReport } from './reports-store'

export const demoReports: Omit<MedicalReport, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete Blood Count (CBC)',
    type: 'blood-test',
    date: '2024-01-15',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    status: 'normal',
    summary: 'Complete blood count shows all parameters within normal range. No signs of infection, anemia, or other hematological abnormalities detected.',
    keyFindings: [
      'Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5)',
      'White Blood Cells: 6,800/μL (Normal: 4,500-11,000)',
      'Platelets: 280,000/μL (Normal: 150,000-450,000)',
      'Red Blood Cells: 4.8 million/μL (Normal: 4.5-5.9)'
    ],
    recommendations: [
      'Continue current diet and lifestyle',
      'Repeat CBC in 6 months for routine monitoring',
      'No immediate concerns identified'
    ],
    tags: ['blood-test', 'routine', 'normal', 'hematology'],
    fileName: 'CBC_Report_2024.pdf',
    fileSize: 245760
  },
  {
    title: 'Chest X-Ray - PA View',
    type: 'x-ray',
    date: '2024-01-10',
    doctor: 'Dr. Michael Chen',
    hospital: 'Medical Imaging Center',
    status: 'normal',
    summary: 'Chest X-ray reveals clear lung fields with no evidence of pneumonia, effusion, or pneumothorax. Heart size and mediastinal contours are within normal limits.',
    keyFindings: [
      'Clear lung bilaterally',
      'Normal heart size',
      'No pleural effusions',
      'No acute cardiopulmonary abnormalities'
    ],
    recommendations: [
      'No follow-up required',
      'Maintain respiratory health',
      'Consider annual screening if risk factors present'
    ],
    tags: ['x-ray', 'chest', 'normal', 'imaging'],
    fileName: 'Chest_XRay_2024.pdf',
    fileSize: 524288
  },
  {
    title: 'Lipid Panel',
    type: 'blood-test',
    date: '2024-01-08',
    doctor: 'Dr. Emily Rodriguez',
    hospital: 'Heart Health Clinic',
    status: 'abnormal',
    summary: 'Lipid panel shows elevated LDL cholesterol and borderline high total cholesterol. HDL cholesterol is within normal range. Triglycerides are slightly elevated.',
    keyFindings: [
      'Total Cholesterol: 225 mg/dL (Normal: <200)',
      'LDL Cholesterol: 145 mg/dL (Normal: <100)',
      'HDL Cholesterol: 52 mg/dL (Normal: >40)',
      'Triglycerides: 165 mg/dL (Normal: <150)'
    ],
    recommendations: [
      'Start low-cholesterol diet',
      'Increase physical activity to 30 minutes daily',
      'Consider statin therapy if levels don\'t improve in 3 months',
      'Repeat lipid panel in 3 months'
    ],
    tags: ['blood-test', 'lipids', 'abnormal', 'cardiovascular'],
    fileName: 'Lipid_Panel_2024.pdf',
    fileSize: 184320
  },
  {
    title: 'MRI Brain - With Contrast',
    type: 'mri',
    date: '2023-12-20',
    doctor: 'Dr. James Wilson',
    hospital: 'Neurology Institute',
    status: 'normal',
    summary: 'Brain MRI with contrast shows no evidence of mass effect, hemorrhage, or acute infarction. Ventricular system and sulci are normal for age. No abnormal enhancement.',
    keyFindings: [
      'No intracranial mass lesions',
      'Normal ventricular size',
      'No evidence of demyelination',
      'Post-contrast sequences show no abnormal enhancement'
    ],
    recommendations: [
      'No neurological concerns identified',
      'Follow up with neurologist as scheduled',
      'No immediate imaging required'
    ],
    tags: ['mri', 'brain', 'normal', 'neurology'],
    fileName: 'Brain_MRI_2023.pdf',
    fileSize: 1048576
  },
  {
    title: 'HbA1c and Fasting Glucose',
    type: 'blood-test',
    date: '2023-12-15',
    doctor: 'Dr. Lisa Park',
    hospital: 'Endocrinology Center',
    status: 'critical',
    summary: 'HbA1c level indicates poor glycemic control. Fasting glucose is significantly elevated, suggesting uncontrolled diabetes. Immediate intervention required.',
    keyFindings: [
      'HbA1c: 9.2% (Normal: <5.7%)',
      'Fasting Glucose: 185 mg/dL (Normal: 70-99)',
      'Previous HbA1c: 8.5% (3 months ago)',
      'Evidence of declining glycemic control'
    ],
    recommendations: [
      'Urgent endocrinology consultation',
      'Medication adjustment required',
      'Intensive diabetes education',
      'Daily glucose monitoring',
      'Follow-up in 2 weeks'
    ],
    tags: ['blood-test', 'diabetes', 'critical', 'endocrinology'],
    fileName: 'Diabetes_Panel_2023.pdf',
    fileSize: 262144
  },
  {
    title: 'Electrocardiogram (ECG)',
    type: 'ecg',
    date: '2023-12-01',
    doctor: 'Dr. Robert Taylor',
    hospital: 'Cardiology Associates',
    status: 'normal',
    summary: '12-lead ECG shows normal sinus rhythm with normal intervals. No ST segment changes, T-wave inversions, or arrhythmias detected.',
    keyFindings: [
      'Sinus rhythm at 72 bpm',
      'Normal PR interval (160ms)',
      'Normal QRS duration (80ms)',
      'Normal QTc interval (420ms)',
      'No pathologic Q waves'
    ],
    recommendations: [
      'Continue current cardiac medications',
      'Routine cardiac follow-up',
      'ECG monitoring if symptoms develop'
    ],
    tags: ['ecg', 'heart', 'normal', 'cardiology'],
    fileName: 'ECG_2023.pdf',
    fileSize: 131072
  },
  {
    title: 'Thyroid Function Panel',
    type: 'blood-test',
    date: '2023-11-20',
    doctor: 'Dr. Amanda White',
    hospital: 'Metabolic Clinic',
    status: 'abnormal',
    summary: 'Thyroid function tests show elevated TSH with normal free T4, consistent with subclinical hypothyroidism. No evidence of overt thyroid dysfunction.',
    keyFindings: [
      'TSH: 6.8 mIU/L (Normal: 0.4-4.0)',
      'Free T4: 1.2 ng/dL (Normal: 0.8-1.8)',
      'T3: 125 ng/dL (Normal: 80-200)',
      'Thyroid antibodies: Negative'
    ],
    recommendations: [
      'Monitor TSH in 3 months',
      'Consider low-dose levothyroxine if symptoms develop',
      'No immediate treatment required',
      'Annual thyroid function testing'
    ],
    tags: ['blood-test', 'thyroid', 'abnormal', 'endocrinology'],
    fileName: 'Thyroid_Panel_2023.pdf',
    fileSize: 196608
  },
  {
    title: 'Abdominal Ultrasound',
    type: 'ultrasound',
    date: '2023-11-10',
    doctor: 'Dr. David Brown',
    hospital: 'Diagnostic Imaging Center',
    status: 'normal',
    summary: 'Abdominal ultrasound shows normal liver, gallbladder, kidneys, spleen, and pancreas. No evidence of masses, cysts, or organ enlargement.',
    keyFindings: [
      'Liver: Normal size and echogenicity',
      'Gallbladder: No stones or wall thickening',
      'Kidneys: Normal size, no hydronephrosis',
      'Spleen: Normal size',
      'Pancreas: Well visualized, no abnormalities'
    ],
    recommendations: [
      'No abdominal pathology identified',
      'Routine follow-up not required',
      'Maintain liver health through lifestyle'
    ],
    tags: ['ultrasound', 'abdomen', 'normal', 'imaging'],
    fileName: 'Abdominal_Ultrasound_2023.pdf',
    fileSize: 786432
  }
]

export const initializeDemoReports = () => {
  if (typeof window !== 'undefined') {
    const { useReportsStore } = require('./reports-store')
    const store = useReportsStore.getState()
    
    // Only add demo reports if store is empty
    if (store.reports.length === 0) {
      demoReports.forEach(report => {
        store.addReport(report)
      })
    }
  }
}
