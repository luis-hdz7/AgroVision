import { CropHealthAnalysis, RiskLevel, HealthStatus } from "./riskTypes";

/*
    * Representa un resumen ejecutivo de riesgo agrícola.
    ! Este contrato permite al dashboard responder preguntas rápidas:
    * - ¿Qué está mal? (mainProblem)
    * - ¿Dónde debo actuar primero? (criticalFactors)
    * - ¿Qué riesgo es más urgente? (recommendedActions)
*/
export interface RiskSummary {
    cropId: string;
    fieldId: string;
    healthScore: number;
    status: HealthStatus;
    riskLevel: RiskLevel;
    mainProblem: string | null;      // Identifica la anomalía principal
    criticalFactors: string[];       // Lista de factores en estado crítico o warning
    recommendedActions: string[];    // Acciones prioritarias a realizar
    generatedAt: string;             // Fecha ISO de generación
}

/*
    * Define el tipo de entrada para el servicio de resumen.
    * Actualmente se deriva directamente del análisis de salud del cultivo.
 */
export type BuildRiskSummaryInput = CropHealthAnalysis;

//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creación y primera edición)
// @luis-hdz7 el 26/6/2026 (documentación técnica)