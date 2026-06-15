# AGROVISION DATA CONTRACT

## Alert
- affectedEntity: string
- severity: 'low' | 'medium' | 'high' | 'critical'
- evidence: Array<{ id: string; type: string; source: string; description?: string; url?: string }>

## Recommendation
- id: string
- fieldId: string
- message: string
- priority: 'low' | 'medium' | 'high'

## CropHealthAnalysis
- fieldId: string
- healthScore: number
- riskLevel: 'low' | 'medium' | 'high' | 'critical'
- recommendations: string[]

## Field
- id: string
- name: string
- cropName: string
- activeAlerts: string[]

## CropCycle
- cropId: string
- stage: string
- startedAt: string
