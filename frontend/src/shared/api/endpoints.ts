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
  //vista  general de la finca
  farmOverview: '/api/farm/overview',
  //parcelas o lotes productivos
  fields: '/api/fields',
  //ciclos de cultivos
  crops: '/api/crops',
  //perfiles estratégicos de cultivos nacionales 
  cropProfiles: '/api/crops/profiles',
  //capa satelital simulada / indices de vegetacion 
  vegetationIndices: '/api/vegetation/indices',
  // análisis prescriptivo por zona 
  zoneAnalysis: '/api/analysis/zone',
  //riesgo por campo o parcela 
  fieldRisk: '/api/risk/field',
  //alertas con evidencia demostrable
  alerts: '/api/alerts',
  // recoimendaciones con evidencia e impacto 
  recommendations: '/api/recommendations',
  // analisis visual vía backend 
  visionAnalyze: '/api/vision/analyze',
} as const;


/**ApiEnpointKey representa los nombres validos dentro de API_ENDPOINTS */
// ejemplo: "dashboardSummary" o "farmOverview"
export type ApiEndpointKey = keyof typeof API_ENDPOINTS;


/** ApiEndpointPath representa los valores reales de las rutas de API_ENDPOINTS */
// ejemplo: "api/dashboard/summary" o "api/farm/overview"
export type ApiEndpointPath = (typeof API_ENDPOINTS)[ApiEndpointKey];


