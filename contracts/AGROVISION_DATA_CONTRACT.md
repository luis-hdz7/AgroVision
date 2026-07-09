# AGROVISION DATA CONTRACT

## ZoneInsight
- `id: string`
- `zoneId: string`
- `fieldId: string`
- `cropType: string`
- `finalRiskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"`
- `healthScore: number`
- `evidence: EvidenceItem[]`
- `mainCause: string`
- `summary: string`
- `recommendedAction: string`
- `generatedAt: string`

## EvidenceItem
- `type: "SATELLITE" | "SIMULATION" | "ROVER_CAMERA" | "UPLOAD"`
- `value: string`
- `description: string`

## Alert
- `id: string`
- `fieldId: string`
- `zoneId?: string | null`
- `type: string`
- `severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"`
- `title: string`
- `message: string`
- `evidence: EvidenceItem[]`
- `recommendedAction: string`
- `status: "ACTIVE" | "RESOLVED" | "IGNORED"`
- `createdAt: string`

## Recommendation
- `id: string`
- `fieldId: string`
- `zoneId?: string | null`
- `priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"`
- `reason: string`
- `suggestedAction: string`
- `expectedImpact: { impactArea: string; description: string }`
- `evidence: EvidenceItem[]`
- `createdAt: string`

## CropProfile
- `cropType: string`
- `name: string`
- `growthStage: string`
- `recommendationTemplates: {
  waterStress: string;
  lowVigor: string;
  inspection: string;
}
