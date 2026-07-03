/**
 * =========================================
 * Dashboard Adapter
 * =========================================
 *
 * adaptador de datos del dashboard
 *
 * Finalidad:
 * - separar la forma externa de datos de la forma que usa la UI
 * - proteger DashboardPage de futuros cambios del backend
 * - mantenber una capa intermedia entre Service y Pages
 *
 * Flujo:
 * dashboardService -> dashboardAdapter -> dashboardPage
 */


import type { DashboardData, DashboardSummary } from "../types/dashboard.types";

/**
 * Adapta la data completa del dashboard.
 * 
 * En esta fase de proyecto el mock ya está alineado con el contrato, pero mantenemos 
 * el adapter para no conectar paginas drectamente a los Mocks o al Backend. 
 */

export function adaptDashboardData(source: DashboardData): DashboardData {
    return {
        summary: adaptDashboardSummary(source.summary),
    };
}

/**
 * Normaliza los arrays internos para evitar mutaciones accidentales desde la UI.
 * 
 */

export function adaptDashboardSummary(summary: DashboardSummary): DashboardSummary {
    return {
        ...summary,
        alerts: {
            ...summary.alerts,
            criticalAlerts:  [...summary.alerts.criticalAlerts],
        },
        recommendations: {
            ...summary.recommendations,
            mainRecommendation : {
                ...summary.recommendations.mainRecommendation,
                evidence: [...summary.recommendations.mainRecommendation.evidence],
            },
        },
    };
}

//con esto el patrón a seguir es el siguiente
// page -> service -> adapter -> Mock fallback