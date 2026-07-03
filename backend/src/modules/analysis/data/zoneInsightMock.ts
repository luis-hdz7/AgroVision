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
                metric: "ndvi",
                value: 0.82,
                unit: null,
                status: "NORMAL",
                explanation:"High vegetation vigor detected across the zone."
            },
            {
                source: "SENSOR",
                metric: "soilMoisturePercentage",
                value: 68,
                unit: "%",
                status: "NORMAL",
                explanation:"Soil moisture remains within optimal range."
            },
            {
                source: "VISION",
                metric: "visualAnomaly",
                value: false,
                status: "NORMAL",
                explanation:"No visual anomalies detected during inspection."
            }
        ],
        mainCause:"Vegetation and moisture indicators remain within expected ranges.",
        summary:"Evidence from satellite, sensor and visual inspection suggests stable crop conditions with good vegetation vigor.",
        recommendedAction:"Maintain current irrigation schedule and continue routine monitoring.",
        generatedAt: "2026-07-03T12:00:00Z"
    },
    {
        id: "ins-002",
        zoneId: "zone-02",
        fieldId: "field-001",
        cropType: "QUEQUISQUE",
        finalRiskLevel: "MEDIUM",
        healthScore: 70,
        evidence: [
            {
                source: "SATELLITE",
                metric: "ndvi",
                value: 0.55,
                status: "WATCH",
                explanation:"Vegetation vigor is lower than optimal."
            },
            {
                source: "SENSOR",
                metric: "soilMoisturePercentage",
                value: 48,
                unit: "%",
                status: "WATCH",
                explanation:"Soil moisture is slightly below the desired range."
            },
            {
                source: "HISTORY",
                metric: "vegetationTrend",
                value: -15,
                unit: "%",
                status: "WARNING",
                explanation:"Recent vegetation trend indicates gradual decline."
            }
        ],
        mainCause:"Evidence suggests moderate reduction in vegetation performance.",
        summary:"The zone shows preliminary signs compatible with moderate stress and should remain under observation.",
        recommendedAction:"Inspect irrigation coverage and perform a field verification.",
        generatedAt: "2026-07-03T12:05:00Z"
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
                source: "SATELLITE",
                metric: "ndvi",
                value: 0.24,
                status: "CRITICAL",
                explanation:"Very low vegetation vigor detected."
            },
            {
                source: "SATELLITE",
                metric: "ndwi",
                value: 0.12,
                status: "CRITICAL",
                explanation:"Canopy water content appears significantly reduced."
            },
            {
                source: "WEATHER",
                metric: "temperatureCelsius",
                value: 38,
                unit: "°C",
                status: "WARNING",
                explanation:"Elevated temperature may increase crop stress."
            },
            {
                source: "VISION",
                metric: "dryAreaDetected",
                value: true,
                status: "WARNING",
                explanation:"Visual inspection detected dry area patterns."
            }
        ],
        mainCause:"Multiple sources indicate conditions compatible with water stress.",
        summary:"Satellite, weather and visual evidence indicate reduced vegetation vigor and low canopy water availability. Technical inspection is recommended.",
        recommendedAction:"Inspect irrigation infrastructure and perform an on-site agronomic assessment.",
        generatedAt: "2026-07-03T12:10:00Z"
    }
];