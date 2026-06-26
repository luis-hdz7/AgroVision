import {CropHealthAnalysis} from "../types/riskTypes";
import {RiskSummary} from "../types/riskSummaryTypes";

/*
    * Convierte un análisis detallado de salud de cultivo (CropHealthAnalysis)
    * en un resumen ejecutivo.
    ! Este servicio extrae los puntos de dolor críticos y las acciones sugeridas,
    * facilitando la toma de decisiones rápidas en el dashboard ejecutivo.
    *
*/
export function buildRiskSummary(analysis: CropHealthAnalysis): RiskSummary {
    // Filtra los factores que requieren atención (WARNING/CRITICAL)
    // para identificar rápidamente la evidencia del problema.
    const criticalFactors = analysis.factors
        .filter(factor => factor.status === "WARNING" || factor.status === "CRITICAL")
        .map(factor => factor.name);

    // Identifica el problema principal a partir de la primera anomalía detectada.
    const mainProblem = analysis.anomalies.length > 0 ? analysis.anomalies[0].description : null;

    return {
        cropId: analysis.cropId,
        fieldId: analysis.fieldId,
        healthScore: analysis.healthScore,
        status: analysis.status,
        riskLevel: analysis.riskLevel,
        mainProblem,              // Responde: ¿Qué está mal?
        criticalFactors,          // Responde: ¿Qué evidencia lo respalda?
        recommendedActions: analysis.recommendations, // Responde: ¿Qué acción se recomienda?
        generatedAt: analysis.generatedAt
    };
}

//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creación y primera edición)
// @luis-hdz7 el 26/6/2026 (documentación técnica aplicada)