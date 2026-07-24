/**
 * =========================================
 * Recommendations Service
 * =========================================
 *
 * Servicio para las recomendaciones prescriptivas.
 *
 * Finalidad:
 * - intentar consumir GET /api/recommendations;
 * - usar fallback local si backend falla;
 * - evitar que RecommendationsPage consuma mocks directamente.
 *
 * Flujo:
 * RecommendationsPage
 *   ↓
 * getRecommendationsData()
 *   ↓
 * backend real si existe
 *   ↓
 * fallback local si backend falla
*/

import { API_ENDPOINTS } from '../../../shared/api/endpoints';
import type { ApiResponse, RecommendationsData, Recommendation } from '../types/recommendations.types';

const RECOMMENDATIONS_ENDPOINT = API_ENDPOINTS.recommendations;

// Fallback local controlado.
const recommendationsFallback: ReadonlyArray<Recommendation> = [
    {
        id: "recommendation-001",
        fieldId: "field-001",
        zoneId: "zone-03",
        priority: "URGENT",
        status: "PENDING",
        reason: "La zona 03 combina bajo vigor vegetal, humedad reducida y evidencia visual compatible con estrés hídrico.",
        suggestedAction: "Priorizar revisión del sistema de riego en zona 03 y aplicar riego correctivo si la inspección confirma déficit.",
        expectedImpact: {
            impactArea: "YIELD_PROTECTION",
            description:"Actuar hoy puede reducir pérdida de vigor y evitar propagación del estrés a zonas vecinas.",
        },
        evidence: [
        {
            source: "SATELLITE",
            metric: "ndvi",
            value: 0.42,
            unit: "index",
            status: "WARNING",
            explanation:"NDVI simulado por debajo del rango esperado para vigor estable.",
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
            explanation: "El análisis visual preliminar detecta señales compatibles con estrés hídrico.",
        },
        ],
        createdAt: "2026-07-01T09:00:00.000Z",
    },
    {
        id: "recommendation-002",
        fieldId: "field-001",
        zoneId: "zone-02",
        priority: "HIGH",
        status: "PENDING",
        reason: "La zona 02 presenta humedad persistente y antecedentes de riesgo fúngico en registros previos.",
        suggestedAction: "Inspeccionar drenaje, revisar follaje bajo y registrar evidencia fotográfica antes de aplicar tratamiento.",
        expectedImpact: {
            impactArea: "DISEASE_PREVENTION",
            description: "La inspección temprana puede evitar avance de riesgo fúngico y reducir costos de tratamiento posterior.",
        },
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
        createdAt: "2026-07-01T09:12:00.000Z",
    },
    {
        id: "recommendation-003",
        fieldId: "field-002",
        zoneId: "zone-01",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        reason:"El cultivo mantiene salud general aceptable, pero la tendencia de vigor debe observarse durante las próximas 48 horas.",
        suggestedAction:"Mantener monitoreo, repetir medición de vigor y comparar con próxima lectura simulada de vegetación.",
        expectedImpact: {
            impactArea: "CROP_HEALTH",
            description:"El seguimiento reduce decisiones reactivas y permite intervenir solo si la tendencia empeora.",
        },
        evidence: [
        {
            source: "SIMULATION",
            metric: "vigorTrend",
            value: "STABLE",
            unit: null,
            status: "NORMAL",
            explanation:
            "La simulación no muestra deterioro crítico, pero recomienda seguimiento.",
        },
        ],
        createdAt: "2026-07-01T09:20:00.000Z",
    },
];

/**
 * Obtiene recomendaciones desde backend.
 *
 * Patrón:
 * 1. intenta backend;
 * 2. valida HTTP;
 * 3. valida ApiResponse<T>;
 * 4. si algo falla, usa fallback.
*/
export async function getRecommendationsData(): Promise<RecommendationsData> {
    try {
        // Se intenta consumir backend real.
        const response = await fetch(RECOMMENDATIONS_ENDPOINT);

        // Si backend responde 404, 500, CORS proxy error, etc., usamos fallback.
        if (!response.ok) {
            return buildRecommendationsData(recommendationsFallback);
        }

        // Se intenta convertir la respuesta a ApiResponse<Recommendation[]>.
        const json = (await response.json()) as ApiResponse<ReadonlyArray<Recommendation>>;

        // El contrato exige success === true y data con contenido.
        if (!json.success || !json.data) {
            return buildRecommendationsData(recommendationsFallback);
        }

        // Si backend respondió bien, se normaliza la data real.
        return buildRecommendationsData(json.data);
    } catch {
        // Error de red, backend apagado, CORS o JSON inválido.
        return buildRecommendationsData(recommendationsFallback);
    }
}

/**
 * Construye la estructura final que consume RecommendationsPage.
 *
 * Funcionamiento:
 * - recibe recomendaciones reales o fallback;
 * - ordena por prioridad;
 * - selecciona recomendación principal;
 * - calcula métricas resumidas;
 * - retorna data lista para UI.
*/
function buildRecommendationsData( recommendations: ReadonlyArray<Recommendation>): RecommendationsData {
    
    // Se crea una copia para no mutar el arreglo original.
    const sortedRecommendations = [...recommendations].sort((first, second) => getPriorityWeight(second.priority) - getPriorityWeight(first.priority));
    
    // La recomendación principal es la de mayor prioridad.
    const mainRecommendation = sortedRecommendations[0] ?? null;  
    
    // Se cuentan solo recomendaciones urgentes.
    const totalUrgent = sortedRecommendations.filter((recommendation) => recommendation.priority === "URGENT").length;


    // High priority debe incluir HIGH + URGENT, no MEDIUM.
    const totalHighPriority = sortedRecommendations.filter((recommendation) => recommendation.priority === "HIGH" || recommendation.priority === "URGENT").length;
    return {
        // se retorna la data recibida, no recommendationsFallback fijo.
        recommendations: sortedRecommendations,
        //se retorna la recomendación principal calculada.
        mainRecommendation: mainRecommendation,
        // Métricas resumen para cards superiores.
        totalUrgent: totalUrgent,
        totalHighPriority: totalHighPriority,
        // Fecha dinámica para indicar cuándo se generó la vista actual.
        generatedAt: new Date().toISOString(),
    };
}

/**
 * Convierte priority en peso numérico, se usa para ordenar primero lo más importante.
 *
 * Funcionamiento:
 * - URGENT vale más;
 * - HIGH queda segundo;
 * - MEDIUM queda tercero;
 * - LOW queda al final;
 * - se usa para ordenar recomendaciones.
*/

function getPriorityWeight(priority: Recommendation["priority"]): number {
    if (priority === "URGENT") return 4;
    if (priority === "HIGH") return 3;
    if (priority === "MEDIUM") return 2;

    // LOW o cualquier prioridad mínima cae aquí.
    return 1;
}
