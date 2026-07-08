import {
    PrescriptiveFieldReport,
} from "../types/prescriptiveReportTypes";

export const prescriptiveReportMock: PrescriptiveFieldReport = {

    fieldId: "FIELD-001",
    zoneId: "ZONE-NORTH-01",
    cropType: "ORANGE",
    healthScore: 62,
    finalRiskLevel: "HIGH",
    mainCause: "Estres hidrico",

    // Evidencias — forma adaptada de ZoneInsight.evidence[] (type, value, description)
    evidence: [
        {
            id: "EV-01",
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.52,
            unit: null,
            status: "WARNING",
            explanation: "Las imágenes satelitales muestran pérdida de vigor en la vegetación.",
            date: "2026-06-28T10:57:00Z",
        },
        {
            id: "EV-02",
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 18,
            unit: "%",
            status: "CRITICAL",
            explanation:
                "Los sensores reportan humedad del suelo inferior al nivel recomendado",
            date: "2026-06-29T08:00:00Z",
        },
        {
            id: "EV-03",
            source: "WEATHER",
            metric: "rainfall",
            value: 0,
            unit: "mmm",
            status: "WARNING",
            explanation:
                "No se registran precipitaciones importantes durante los ultimos 12 dias",
            date: "2026-06-29T10:57:00Z",
        },
        {
            id: "EV-04",
            source: "HISTORY",
            metric: "historicalPattern",
            value: "Evento similar: hace 10 meses",
            unit: null,
            status: "WATCH",
            explanation:
                "Esta zona presento estres hidrico similar hace 10 meses bajo condiciones comparables",
            date: "2026-06-25T00:00:00Z",
        },
    ],

    // Alertas — severity reemplaza a level (coincide con AgriculturalAlert.severity, RiskLevel)
    activeAlerts: [
        {
            id: "AL-01",
            zoneId: "ZONE-NORTH-01",
            severity: "HIGH",
            message: "Estres hidrico critico.",
        },
        {
            id: "AL-02",
            zoneId: "ZONE-NORTH-01",
            severity: "MEDIUM",
            message: "Posible aparicion de enfermedad foliar.",
        },
    ],

    // Recomendaciones — relatedEvidenceIds vincula con evidence[] para trazabilidad
    recommendations: [
        {
            id: "REC-01",
            zoneId: "ZONE-NORTH-01",
            recommendation: "Aplicar riego suplementario en la zona norte",
            priority: "HIGH",
            relatedEvidenceIds: ["EV-01", "EV-02", "EV-03"],
        },
    ],

    actionsTaken: [],

    pendingActions: [
        {
            id: "PEND-01",
            description: "Programar riego suplementario en sector norte",
            dueDate: "2026-07-02T00:00:00Z",
            priority: "HIGH",
        },
    ],

    createdAt: "2026-06-29T11:00:00Z",
};