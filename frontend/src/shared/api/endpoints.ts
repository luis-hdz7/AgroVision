// Archivo encargado de centralizar las rutas del backend

/**
 * =========================================
 * API Endpoints
 * =========================================
 *
 * constantes globales de endpoint del frontend
 *
 * Finalidad:
 * - evitar strings sueltos dentro de componentes o services
 * - mantener las rutas alineadas con el contrato
 * - facilita cambios futuros, por si backend realiza modificaciones en una ruta
 *
 * Regla:
 * si un endpoint existe aqui, ningun archivo debe escribir manualmente esa ruta
 */

// rutas base de la app
export const API_ENDPOINTS = {
  dashboardSummary: '/api/dashboard/summary',
  farmOverview: '/api/farm/overview',
  fields: '/api/fields',
  crops: '/api/crops',
  alerts: '/api/alerts',
  recommendations: '/api/recommendations',
} as const;

/**ApiEnpointKey representa los nombres validos dentro de API_ENDPOINTS */
// ejemplo: "dashboardSummary" o "farmOverview"
export type ApiEnpointKey = keyof typeof API_ENDPOINTS;

/** ApiEndpointPath representa los valores reales de las rutas de API_ENDPOINTS */
// ejemplo: "api/dashboard/summary" o "api/farm/overview"
export type ApiEndpointPath = (typeof API_ENDPOINTS)[ApiEnpointKey];
