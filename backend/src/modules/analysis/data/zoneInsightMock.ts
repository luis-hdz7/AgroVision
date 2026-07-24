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
            status: "NORMAL",
            explanation: "High vegetation vigor detected."
        },
        {
            source: "SATELLITE",
            metric: "ndwi",
            value: 0.55,
            status: "NORMAL",
            explanation: "Vegetation water content remains within expected range."
        },
        {
            source: "SATELLITE",
            metric: "gndvi",
            value: 0.71,
            status: "NORMAL",
            explanation: "Vegetation greenness remains within expected range."
        },
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 68,
            unit: "%",
            status: "NORMAL",
            explanation: "Soil moisture remains within optimal range."
        },
        {
            source: "VISION",
            metric: "visualAnomaly",
            value: false,
            status: "NORMAL",
            explanation: "No visual anomalies detected."
        },
        {
            source: "HISTORY",
            metric: "vegetationTrend",
            value: 2,
            unit: "%",
            status: "NORMAL",
            explanation: "Vegetation trend remains stable."
        }
    ],
    mainCause:"Vegetation and moisture indicators remain within expected ranges.",
    summary:"Current evidence indicates stable crop conditions with no significant anomalies detected.",
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
            value: 0.56,
            status: "WATCH",
            explanation: "Vegetation vigor should be monitored."
        },
        {
            source: "SATELLITE",
            metric: "ndwi",
            value: 0.35,
            status: "WATCH",
            explanation: "Water availability should be monitored."
        },
        {
            source: "SATELLITE",
            metric: "gndvi",
            value: 0.52,
            status: "WATCH",
            explanation: "Vegetation greenness should be monitored."
        },
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 48,
            unit: "%",
            status: "WATCH",
            explanation: "Soil moisture is slightly below the desired range."
        },
        {
            source: "HISTORY",
            metric: "vegetationTrend",
            value: -15,
            unit: "%",
            status: "WATCH",
            explanation: "Moderate negative vegetation trend detected."
        }
    ],
    mainCause:"Evidence suggests moderate reduction in vegetation performance.",
    summary:"Vegetation indices indicate reduced vigor compared to expected crop conditions. Further inspection is recommended.",
    recommendedAction:
    "Schedule a preventive field inspection, verify soil moisture conditions and monitor irrigation performance. Reassess the affected zone after the next monitoring cycle.",
    generatedAt: "2026-07-03T12:05:00Z"
    },
    {
    id: "ins-003",
    zoneId: "zone-03",
    fieldId: "field-001",
    cropType: "ORANGE",
    finalRiskLevel: "HIGH",
    healthScore: 35,
    evidence: [
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 28,
            unit: "%",
            status: "CRITICAL",
            explanation: "Critical soil moisture deficit detected."
        },
        {
            source: "WEATHER",
            metric: "temperatureCelsius",
            value: 38,
            unit: "°C",
            status: "WARNING",
            explanation: "Elevated temperature may increase crop stress."
        },
        {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.24,
            status: "CRITICAL",
            explanation: "Very low vegetation vigor detected."
        },
        {
            source: "SATELLITE",
            metric: "ndwi",
            value: 0.12,
            status: "CRITICAL",
            explanation: "Very low canopy water content detected."
        },
        {
            source: "SATELLITE",
            metric: "gndvi",
            value: 0.22,
            status: "CRITICAL",
            explanation: "Severe reduction in chlorophyll activity detected."
        },
        {
            source: "VISION",
            metric: "visualAnomaly",
            value: true,
            status: "WARNING",
            explanation: "Visual anomaly detected."
        },
        {
            source: "VISION",
            metric: "dryAreaDetected",
            value: true,
            status: "WARNING",
            explanation: "Dry area patterns detected during visual inspection."
        },
        {
            source: "VISION",
            metric: "chlorosisDetected",
            value: true,
            status: "WARNING",
            explanation: "Visual signs compatible with chlorosis were detected."
        },
        {
            source: "HISTORY",
            metric: "vegetationTrend",
            value: -35,
            unit: "%",
            status: "WARNING",
            explanation: "Negative vegetation trend detected."
        },
        {
            source: "MAPPING",
            metric: "mappingRiskDetected",
            value: true,
            status: "WARNING",
            explanation: "Spatial analysis identified a potential risk area."
        }
    ],
    mainCause:"Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
    summary:"Multiple evidence sources consistently indicate severe vegetation deterioration associated with water stress. Immediate field inspection and corrective irrigation assessment are recommended to prevent further crop decline.",
    recommendedAction:"Immediately inspect the affected zone, verify irrigation system performance, confirm soil moisture conditions and prioritize corrective irrigation to reduce further crop deterioration.",
    generatedAt: "2026-07-03T12:10:00Z"
}
];