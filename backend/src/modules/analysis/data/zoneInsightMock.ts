import { ZoneInsight } from "../types/zoneInsightTypes";

export const zoneInsightMock: ZoneInsight[] = [
    {
        id: "ins-001",
        zoneId: "zone-01",
        fieldId: "field-001",
        cropType: "RED_BEAN",
        finalRiskLevel: "LOW",
        healthScore: 92,
        evidence: [
            {
                source: "SATELLITE",
                metric: "NDVI",
                value: 0.78,
                unit: null,
                status: "NORMAL",
                explanation: "High chlorophyll absorption with no signs of water stress."
            }
        ],
        mainCause: "Ideal soil and weather conditions.",
        summary: "Stable zone. Crop is in excellent vegetative condition.",
        recommendedAction: "Maintain the scheduled irrigation plan and continue routine satellite monitoring.",
        generatedAt: "2026-06-29T15:00:00Z"
    },
    {
        id: "ins-002",
        zoneId: "zone-02",
        fieldId: "field-001",
        cropType: "QUEQUISQUE",
        finalRiskLevel: "MEDIUM",
        healthScore: 68,
        evidence: [
            {
                source: "SIMULATION",
                metric: "NDWI",
                value: 0.18,
                unit: null,
                status: "WARNING",
                explanation: "Predictive model detected possible water accumulation."
            }
        ],
        mainCause: "Poor drainage in the micro-relief of the area.",
        summary: "Zone under observation. Excess moisture accumulation has been detected.",
        recommendedAction: "Inspect secondary drainage channels to prevent root rot.",
        generatedAt: "2026-06-29T15:10:00Z"
    },
    {
        id: "ins-003",
        zoneId: "zone-03",
        fieldId: "field-002",
        cropType: "ORANGE",
        finalRiskLevel: "HIGH",
        healthScore: 35,
        evidence: [
            {
                source: "ROVER_CAMERA",
                metric: "Visual Inspection",
                value: "RGB Images",
                unit: null,
                status: "CRITICAL",
                explanation: "Visual detection of defoliation and mottled chlorosis."
            },
            {
                source: "SATELLITE",
                metric: "GNDVI",
                value: 0.28,
                unit: null,
                status: "CRITICAL",
                explanation: "Severe drop in vegetation index across the zone."
            }
        ],
        mainCause: "Leaf anomaly compatible with early structural pest symptoms.",
        summary: "Critical zone. Significant loss of vegetation vigor and photosynthetic biomass.",
        recommendedAction: "Deploy a technical field team immediately, collect physical samples, and isolate the affected area",
        generatedAt: "2026-06-29T15:20:00Z"
    }
]