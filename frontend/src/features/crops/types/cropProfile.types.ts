/**
 * =========================================
 * Crop Profile Types
 * =========================================
 *
 * Tipos para perfiles de cultivos estratégicos.
 * preparan la UI para representar reglas, riesgos y recomendaciones ajustadas por cultivo.
 *
 * IMPORTANTE:
 * - define la base de cultivos estratégicos.
 * - no contiene datos, solo contratos. Así se evita duplicar estructuras cuando backend entregue: GET /api/crops/profiles
 * - Los perfiles solo contextualizan el análisis prescriptivo.
 * =========================================
 */


// Cultivos estratégicos definidos para el proyecto 
export type CropType =
  | "RED_BEAN"
  | "CASSAVA"
  | "QUEQUISQUE"
  | "ORANGE"
  | "SORGHUM"
  | "PEANUT"
  | "GENERAL";


// Riesgos principales usados por perfiles y recomendaciones
export type CropRiskType =
  | "WATER_STRESS"
  | "FUNGAL_RISK"
  | "LOW_VIGOR"
  | "HEAT_STRESS"
  | "NUTRIENT_STRESS"
  | "VISUAL_ANOMALY";


// Metricas para interpretar cada cultivo 
export type CropMetric = 
  | "ndvi"
  | "ndwi"
  | "gndvi"
  | "soilMoisturePercentage"
  | "temperatureCelsius"
  | "greenCoveragePercentage"
  | "dryAreaPercentage"
  | "chlorosisSuspected"
  | "leafSpotSuspected";

/** Reglas simples para ajustar sensibilidadm del motor de riesgo  
 * backend usará logica real; el frontend solo representa el contrato
*/
export interface CropRiskRules {
    readonly waterStressSensitive: boolean;
    readonly fungalRiskSensitive: boolean;
    readonly heatStressSensitive: boolean;
    readonly nutrientStressSensitive: boolean;
}

/** Plantillas base de recomendación.
 * sirven para mostrar acciones prescriptivas según riesgo.
*/
export interface CropRecommendationTemplates {
    readonly waterStress: string;
    readonly fungalRisk: string;
    readonly lowVigor: string;
    readonly inspection: string;
}

/** Perfil completo de cultivo.
 * Este contrato permite que la UI muestre contexto agrícola específico.
*/
export interface CropProfile {
    readonly cropType: CropType;
    readonly displayName: string;
    readonly scientificName?: string | null;
    readonly analysisFocus: ReadonlyArray<string>;
    readonly mainRisks: ReadonlyArray<CropRiskType>;

    readonly riskRules: CropRiskRules;

    readonly preferredMetrics: ReadonlyArray<CropMetric>;

    readonly recommendationTemplates: CropRecommendationTemplates;
}

