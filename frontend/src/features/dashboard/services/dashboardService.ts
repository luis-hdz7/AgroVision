
/**
 * =========================================
 * Dashboard Service
 * =========================================
 *
 * Servicio frontend para el dahboard prescriptivo 
 *
 * Finalidad:
 * - centralizar la obtención de datos del dashboard
 * - ocultar la pagina si los datos vienen del backend o del mock 
 * - preparar el reemplazo futuro por el fetch real 
 *
 */


import { API_ENDPOINTS } from "../../../shared/api/endpoints";
import type { DashboardData } from "../types/dashboard.types";
import { adaptDashboardData } from "./dashboardAdapter";
import { dashboardMock } from "./dashboardMock";


// endpoint oficial que backend deberá entregar
export const DASHBOARD_SUMMARY_ENDPOINT = API_ENDPOINTS.dashboardSummary;

/**
 * Obtiene los datos del dashboard.
 * 
 * ps: por ahora usa mock local, luego se reemplaza internamente por fetch(DASHBOARD_SUMMARY_ENDPOINT).
 * sin necesidad de tocar DASHBOARDPAGE
 */

export async function getDashboardData(): Promise<DashboardData> {
    //ps: este es el mock fallback en lo que backend termina /api/dashboard/summary.
    return adaptDashboardData(dashboardMock);
}

