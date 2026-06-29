import { ZoneInsight } from "../types/zoneInsightTypes";

export const zoneInsightMock: ZoneInsight[] = [
    {
        id: "ins-001",
        zoneId: "zone-01",
        fieldId: "field-001",
        cropType: "RED_BEAN",
        finalRiksLevel: "LOW",
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
        recomendedAction: "Mantener el calendario de riego programado y continuar monitoreo satelital estándar.",
        generatedAt: "2026-06-29T15:00:00Z"
    }
]