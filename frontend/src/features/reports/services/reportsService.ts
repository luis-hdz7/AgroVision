/**
 * =========================================
 * Reports Service
 * =========================================
 *
 * Servicio para reportes prescriptivos.
 *
 * Finalidad:
 * - intentar consumir GET /api/reports/prescriptive/:zoneId;
 * - validar ApiResponse<T>;
 * - usar fallback local si backend falla;
 * - evitar que ReportsPage consuma mocks directamente.
 *
 * Flujo:
 * ReportsPage
 *   ↓
 * getPrescriptiveReportByZone()
 *   ↓
 * backend real si existe
 *   ↓
 * fallback local si backend falla
 */


import { API_ENDPOINTS } from '../../../shared/api/endpoints';
import type { ApiResponse, PrescriptiveReport, ReportsData } from '../types/reports.types';

const REPORTS_PRESCRIPTIVE_ENDPOINT = API_ENDPOINTS.reportsPrescriptiveBase;


// Fallback alineado con los valores del backend para zone-03 (field-001 / ORANGE / HIGH).
// Valores tomados de: zoneInsightMock.ts, alertsMock.ts, recommendationsMock.ts, fieldNotebookMock.ts
const reportFallback: PrescriptiveReport = {
    reportId: "report-zone-03-001",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropType: "ORANGE",
    healthScore: 35,
    finalRiskLevel: "HIGH",

    mainCause: "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
    summary: "Multiple evidence sources consistently indicate severe vegetation deterioration associated with water stress. Immediate field inspection and corrective irrigation assessment are recommended to prevent further crop decline.",

    evidence: [
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 28,
            unit: "%",
            status: "WARNING",
            explanation: "Humedad estimada por debajo del umbral operativo del cultivo.",
            capturedAt: "2026-07-01T08:20:00.000Z", 
        },
        {
            source: "VISION",
            metric: "prediction",
            value: "WATER_STRESS",
            unit: null,
            status: "WARNING",
            explanation: "Análisis visual preliminar compatible con estrés hídrico.",
            capturedAt: "2026-07-01T08:25:00.000Z",
        },
        {
            source: "WEATHER",
            metric: "temperatureCelsius",
            value: 38,
            unit: "°C",
            status: "WARNING",
            explanation: "Elevated temperature may increase crop stress.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.24,
            unit: "index",
            status: "CRITICAL",
            explanation: "Very low vegetation vigor detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "SATELLITE",
            metric: "ndwi",
            value: 0.12,
            unit: "index",
            status: "CRITICAL",
            explanation: "Very low canopy water content detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "SATELLITE",
            metric: "gndvi",
            value: 0.22,
            unit: "index",
            status: "CRITICAL",
            explanation: "Severe reduction in chlorophyll activity detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "VISION",
            metric: "visualAnomaly",
            value: true,
            unit: null,
            status: "WARNING",
            explanation: "Visual anomaly detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "VISION",
            metric: "dryAreaDetected",
            value: true,
            unit: null,
            status: "WARNING",
            explanation: "Dry area patterns detected during visual inspection.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "VISION",
            metric: "chlorosisDetected",
            value: true,
            unit: null,
            status: "WARNING",
            explanation: "Visual signs compatible with chlorosis were detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "HISTORY",
            metric: "vegetationTrend",
            value: -35,
            unit: "%",
            status: "WARNING",
            explanation: "Negative vegetation trend detected.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
        {
            source: "MAPPING",
            metric: "mappingRiskDetected",
            value: true,
            unit: null,
            status: "WARNING",
            explanation: "Spatial analysis identified a potential risk area.",
            capturedAt: "2026-07-03T12:10:00.000Z",
        },
    ],

    activeAlerts: [
        {
            id: "alert-zone-03-low_vigor",
            type: "LOW_VIGOR",
            severity: "HIGH",
            title: "Reduced vegetation vigor (ORANGE)",
            message: "Multiple vegetation indicators suggest reduced crop vigor in ORANGE. Technical field verification is recommended to identify the underlying cause.",
            recommendedAction: "Inspect irrigation coverage and verify soil moisture conditions.",
            createdAt: "2026-07-03T12:10:00.000Z",
        },
        {
            id: "alert-zone-03-visual_anomaly",
            type: "VISUAL_ANOMALY",
            severity: "HIGH",
            title: "Visual anomaly detected (ORANGE)",
            message: "Visual inspection detected anomalies compatible with vegetation stress in ORANGE. Field verification is recommended before applying corrective measures.",
            recommendedAction: "Inspect irrigation coverage and verify soil moisture conditions.",
            createdAt: "2026-07-03T12:10:00.000Z",
        },
        {
            id: "alert-zone-03-water_stress",
            type: "WATER_STRESS",
            severity: "HIGH",
            title: "Potential water stress (ORANGE)",
            message: "Low soil moisture and vegetation water indicators suggest conditions compatible with water stress. Irrigation infrastructure and field conditions should be verified.",
            recommendedAction: "Estrés hídrico detectado en periodo crítico de floración del Naranjo. Activar riego controlado inmediato.",
            createdAt: "2026-07-03T12:10:00.000Z",
        },
        {
            id: "alert-zone-03-heat_stress",
            type: "HEAT_STRESS",
            severity: "HIGH",
            title: "Potential heat stress (ORANGE)",
            message: "Elevated air temperature may increase crop stress and reduce vegetation performance. Continue monitoring environmental conditions and perform field verification if required.",
            recommendedAction: "Inspect irrigation coverage and verify soil moisture conditions.",
            createdAt: "2026-07-03T12:10:00.000Z",
        },
    ],

    recommendations: [
        {
            id: "rec-zone-03-water_stress",
            priority: "HIGH",
            reason: "Multiple evidence sources indicate severe vegetation deterioration associated with water stress and reduced canopy vigor.",
            suggestedAction: "Estrés hídrico detectado en periodo crítico de floración del Naranjo. Activar riego controlado inmediato.",
            expectedImpact: {
                impactArea: "YIELD_PROTECTION",
                description: "Actuar hoy puede reducir pérdida de vigor y evitar propagación del estrés a zonas vecinas.",
            },
            createdAt: "2026-07-03T12:10:00.000Z",
        },
    ],

    actionsTaken: [
        {
            id: "fn-001",
            title: "Inspección visual inicial",
            description:
                "Se registró la anomalía y se documentó evidencia visual para soportar la evaluación técnica de la zona.",
            status: "DONE",
            responsible: "Sofía Vega",
            registeredAt: "2026-06-29T16:00:00.000Z",
            evidence: [
                {
                    id: "evid-fn-001",
                    type: "image",
                    source: "VISION",
                    description: "Fotografía de campo con clorosis visible y áreas secas en la zona zone-03.",
                    url: "https://example.org/evidence/fn-001.jpg",
                    capturedAt: "2026-06-29T16:00:00.000Z",
                },
            ],
        },
        {
            id: "fn-002",
            title: "Riego correctivo aplicado",
            description:
                "Se activó un riego suplementario de emergencia para recuperar la disponibilidad de agua en la zona radicular.",
            status: "DONE",
            responsible: "Julián León",
            registeredAt: "2026-06-29T17:00:00.000Z",
            evidence: [
                {
                    id: "evid-fn-002",
                    type: "sensor",
                    source: "SENSOR",
                    description: "Lectura de humedad del suelo inferior al umbral crítico para la zona zone-03.",
                    capturedAt: "2026-06-29T17:00:00.000Z",
                },
            ],
        },
    ],

    pendingActions: [
        {
            id: "fn-003",
            title: "Seguimiento pendiente",
            description:
                "Revisar la zona dentro de 24-48 horas y validar si se requiere intervención adicional o inspección de plagas.",
            status: "PENDING",
            responsible: "Carla Mena",
            registeredAt: "2026-06-30T08:00:00.000Z",
            evidence: [
                {
                    id: "evid-fn-003",
                    type: "note",
                    source: "MANUAL",
                    description: "Nota de campo con seguimiento pendiente y próximos pasos para la zona zone-03.",
                    capturedAt: "2026-06-30T08:00:00.000Z",
                },
            ],
        },
    ],

    createdAt: "2026-07-03T12:10:00.000Z",
};


export async function getPrescriptiveReportByZone(zoneId: string): Promise<ReportsData> {
    try {
        const response = await fetch(`${REPORTS_PRESCRIPTIVE_ENDPOINT}/${zoneId}`);

        // Si backend responde error, usamos fallback controlado.
        if (!response.ok) {
            return buildReportsData(reportFallback);
        }

        const json = (await response.json()) as ApiResponse<PrescriptiveReport>;

        // El contrato exige success + data.
        if (!json.success || !json.data) {
            return buildReportsData(reportFallback);
        }

        return buildReportsData(json.data);
    } catch {
        // Backend apagado, CORS, red local o endpoint pendiente.
        return buildReportsData(reportFallback);
    }
}

/**
 * Construye la data exacta que necesita ReportsPage.
 */
function buildReportsData(report: PrescriptiveReport): ReportsData {
    return {
        report,
        generatedAt: new Date().toISOString(),
    };
}
