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
                type: "SATELLITE",
                value: "NDVI: 0.78",
                description: "Alta absorción de clorofila libre de estrés hídrico."
            }
        ],
        mainCause: "Condiciones climáticas y de suelo ideales.",
        summary: "Zona estable. El cultivo se encuentra en un estado de desarrollo vegetativo excelente.",
        recommendedAction: "Mantener el calendario de riego programado y continuar monitoreo satelital estándar.",
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
                type: "SIMULATION",
                value: "NDWI: 0.18",
                description: "Modelo predictivo alerta posible saturación estancada."
            }
        ],
        mainCause: "Drenaje deficiente en micro-relieve de la zona.",
        summary: "Zona en observación. Se registra una propensión a la acumulación excesiva de humedad.",
        recommendedAction: "Inspeccionar los canales de desagüe secundarios para prevenir pudrición del cormo.",
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
                type: "ROVER_CAMERA",
                value: "Imágenes RGB Rover",
                description: "Detección visual de defoliación y clorosis moteada."
            },
            {
                type: "SATELLITE",
                value: "GNDVI: 0.28",
                description: "Caída severa en el índice verde de la zona."
            }
        ],
        mainCause: "Anomalía foliar compatible con síntomas iniciales de plaga estructural.",
        summary: "Zona crítica. Pérdida drástica de biomasa fotosintética y vigor.",
        recommendedAction: "Desplegar cuadrilla técnica para toma de muestras físicas inmediatas y aislar el sector.",
        generatedAt: "2026-06-29T15:20:00Z"
    }
]