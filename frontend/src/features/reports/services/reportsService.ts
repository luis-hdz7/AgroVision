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


const reportFallback: PrescriptiveReport = {
    reportId: "report-zone-03-001",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropType: "ORANGE",
    healthScore: 35,
    finalRiskLevel: "HIGH",

    mainCause: "Bajo vigor vegetal combinado con humedad reducida y señales visuales compatibles con estrés hídrico.",
    summary: "La zona 03 del cultivo de naranjo presenta deterioro localizado. La evidencia multifuente sugiere priorizar revisión de riego y seguimiento visual en las próximas 24 horas.",

    evidence: [
        {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.42,
            unit: "index",
            status: "WARNING",
            explanation: "NDVI simulado por debajo del rango esperado para vigor estable.",
            capturedAt: "2026-07-01T08:15:00.000Z",
        },
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 34,
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
            value: 33,
            unit: "°C",
            status: "WATCH",
            explanation: "Temperatura elevada aumenta la demanda hídrica durante el día.",
            capturedAt: "2026-07-01T08:30:00.000Z",
        },
    ],

    activeAlerts: [
        {
            id: "alert-001",
            type: "WATER_STRESS",
            severity: "HIGH",
            title: "Riesgo alto de estrés hídrico",
            message: "Zona 03 presenta bajo vigor, humedad reducida y evidencia visual compatible con estrés hídrico.",
            recommendedAction: "Revisar riego en zona 03, verificar presión del sistema y repetir inspección visual en 24 horas.",
            createdAt: "2026-07-01T08:40:00.000Z",
        },
    ],

    recommendations: [
        {
            id: "recommendation-001",
            priority: "URGENT",
            reason:
                "La zona 03 combina bajo vigor vegetal, humedad reducida y evidencia visual de estrés.",
            suggestedAction:
                "Priorizar revisión del sistema de riego en zona 03 y aplicar riego correctivo si la inspección confirma déficit.",
            expectedImpact: {
                impactArea: "YIELD_PROTECTION",
                description: "Actuar hoy puede reducir pérdida de vigor y evitar propagación del estrés a zonas vecinas.",
            },
            createdAt: "2026-07-01T08:45:00.000Z",
        },
    ],

    actionsTaken: [
        {
            id: "action-001",
            title: "Registro de evidencia visual",
            description:
                "Se registró imagen de referencia para análisis visual preliminar en zona 03.",
            status: "DONE",
            responsible: "Técnico de campo",
            registeredAt: "2026-07-01T08:25:00.000Z",
        },
    ],

    pendingActions: [
        {
            id: "action-002",
            title: "Revisión del sistema de riego",
            description:
                "Verificar presión, obstrucciones y distribución de agua en zona 03.",
            status: "PENDING",
            responsible: "Equipo agrícola",
            registeredAt: "2026-07-01T09:00:00.000Z",
        },
        {
            id: "action-003",
            title: "Nueva medición en 24 horas",
            description:
                "Repetir inspección visual y comparar NDVI simulado con medición anterior.",
            status: "PENDING",
            responsible: "Equipo técnico",
            registeredAt: "2026-07-01T09:05:00.000Z",
        },
    ],

    createdAt: "2026-07-01T09:10:00.000Z",
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
