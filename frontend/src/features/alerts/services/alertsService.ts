/**
 * =========================================
 * Alerts Service
 * =========================================
 *
 * Servicio para alertas prescriptivas.
 *
 * Finalidad:
 * - intentar consumir GET /api/alerts;
 * - validar ApiResponse<T>;
 * - usar fallback local si backend falla;
 * - evitar que AlertsPage consuma mocks directamente.
*/

import { API_ENDPOINTS } from '../../../shared/api/endpoints';
import type { ApiResponse, AlertsData, AgriculturalAlert} from '../types/alerts.types';

const ALERTS_ENDPOINT = API_ENDPOINTS.alerts;



/**
 * Mock fallback local.
 *
 * Se usa cuando backend no está disponible.
 * así la pantalla nunca debe quedar en blanco por backend caído.
*/

const alertsFallback: ReadonlyArray<AgriculturalAlert> = [
    {
        id: "alert-001",
        fieldId: "field-001",
        zoneId: "zone-03",
        type: "WATER_STRESS",
        severity: "HIGH",
        title: "Riesgo alto de estrés hídrico",
        message: "Zona 03 presenta bajo vigor, humedad reducida y evidencia visual compatible con estrés hídrico.",
        evidence: [
        {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.42,
            unit: "index",
            status: "WARNING",
            explanation: "NDVI simulado por debajo del rango esperado para vigor estable.",
        },
        {
            source: "SENSOR",
            metric: "soilMoisturePercentage",
            value: 34,
            unit: "%",
            status: "WARNING",
            explanation: "Humedad estimada por debajo del umbral operativo del cultivo.",
        },
        {
            source: "VISION",
            metric: "prediction",
            value: "WATER_STRESS",
            unit: null,
            status: "WARNING",
            explanation: "La imagen analizada presenta señales compatibles con estrés hídrico.",
        },
        ],
        recommendedAction: "Revisar riego en zona 03, verificar presión del sistema y repetir inspección visual en 24 horas.",
        status: "ACTIVE",
        createdAt: "2026-07-01T08:30:00.000Z",
        resolvedAt: null,
    },
    {
        id: "alert-002",
        fieldId: "field-001",
        zoneId: "zone-02",
        type: "FUNGAL_RISK",
        severity: "MEDIUM",
        title: "Riesgo fúngico por humedad elevada",
        message:"Zona 02 mantiene humedad persistente y requiere inspección preventiva.",
        evidence: [
        {
            source: "WEATHER",
            metric: "relativeHumidityPercentage",
            value: 82,
            unit: "%",
            status: "WATCH",
            explanation: "Humedad relativa elevada puede favorecer riesgo fúngico si se mantiene.",
        },
        {
            source: "HISTORY",
            metric: "previousIncidents",
            value: 2,
            unit: "records",
            status: "WATCH",
            explanation: "Existen registros previos de humedad excesiva en la zona.",
        },
        ],
        recommendedAction: "Inspeccionar drenaje, revisar follaje bajo y registrar evidencia fotográfica.",
        status: "ACTIVE",
        createdAt: "2026-07-01T08:45:00.000Z",
        resolvedAt: null,
    },
]

/**
 * Obtiene alertas desde backend.
 *
 * si el backend falla, retorna fallback local.
*/

export async function getAlertsData(): Promise<AlertsData> {
    try {
        const response = await fetch(ALERTS_ENDPOINT);

        // Si el backend responde error HTTP, se activa fallback.
        if (!response.ok) {
            return buildAlertsData(alertsFallback);
        }
        const json = (await response.json()) as ApiResponse<ReadonlyArray<AgriculturalAlert>>;

        // Si la forma ApiResponse no es válida, se activa fallback.
        if (!json.success || !json.data) {
        return buildAlertsData(alertsFallback);
        }

        return buildAlertsData(json.data);
    } catch {
        // Backend caído, CORS, red local o endpoint no montado.
        return buildAlertsData(alertsFallback);
    }

}

function buildAlertsData(alerts: ReadonlyArray<AgriculturalAlert>): AlertsData {
    const activeAlerts = alerts.filter((alert) => alert.status === "ACTIVE");
    return {
        alerts,
        totalActive: activeAlerts.length,
        totalCritical: activeAlerts.filter(
        (alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH"
        ).length,
        generatedAt: new Date().toISOString(),
    };
}