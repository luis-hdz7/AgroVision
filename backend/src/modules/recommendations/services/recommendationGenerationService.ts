import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { CropProfile } from "../../crops/types/cropProfileTypes";
import { AgriculturalAlert } from "../../alerts/types/alertsTypes";
import {Recommendation,RecommendationPriority,ExpectedImpact} from "../types/recommendationTypes";

/*
    * Convierte el nivel de riesgo en prioridad de recomendación.
 */
function mapPriority(riskLevel: ZoneInsight["finalRiskLevel"]): RecommendationPriority {
    switch (riskLevel) {
        case "CRITICAL":
            return "URGENT";
        case "HIGH":
            return "HIGH";
        case "MEDIUM":
            return "MEDIUM";
        default:
            return "LOW";
    }
}

/*
    * Define el impacto esperado según el tipo de alerta.
*/
function getExpectedImpact(alertType: AgriculturalAlert["type"]): ExpectedImpact {
    switch (alertType) {
        case "WATER_STRESS":
            return {
                impactArea: "WATER_SAVING",
                description:"Reduce pérdidas por estrés hídrico y mejora la eficiencia del riego."
            };

        case "LOW_VIGOR":
            return {
                impactArea: "CROP_HEALTH",
                description:"Favorece la recuperación del vigor y la estabilidad fisiológica del cultivo."
            };

        case "HEAT_STRESS":
            return {
                impactArea: "YIELD_PROTECTION",
                description:"Disminuye el impacto de temperaturas elevadas sobre el rendimiento."
            };

        case "VISUAL_ANOMALY":
            return {
                impactArea: "DISEASE_PREVENTION",
                description:"Permite detectar oportunamente problemas sanitarios o estructurales."
            };

        default:
            return {
                impactArea: "CROP_HEALTH",
                description:"Contribuye al mantenimiento general del cultivo."
            };
    }
}

/*
    * Obtiene la acción sugerida.
    * Si existe un CropProfile se usan sus plantillas.
    * Si no existe, se utiliza la acción sugerida del insight.
*/
function resolveSuggestedAction(
    alert: AgriculturalAlert,
    insight: ZoneInsight,
    cropProfile?: CropProfile): string {

    if (!cropProfile) {
        return insight.recommendedAction;
    }
    switch (alert.type) {
        case "WATER_STRESS":
            return cropProfile.recommendationTemplates.waterStress;
        case "LOW_VIGOR":
            return cropProfile.recommendationTemplates.lowVigor;
        case "VISUAL_ANOMALY":
            return cropProfile.recommendationTemplates.inspection;
        default:
            return insight.recommendedAction;
    }
}

/*
    * Generador principal de recomendaciones.
    * Cada alerta genera una recomendación respaldada por evidencia.
*/
export function generateRecommendations(
    insight: ZoneInsight,
    alerts: AgriculturalAlert[],
    cropProfile?: CropProfile): Recommendation[] {

    return alerts.map(alert => ({
        id: `rec-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
        fieldId: insight.fieldId,
        zoneId: insight.zoneId,
        priority: mapPriority(insight.finalRiskLevel),
        reason: alert.type === "LOW_VIGOR"? insight.mainCause: alert.message,suggestedAction: resolveSuggestedAction(
            alert,
            insight,
            cropProfile),
        expectedImpact: getExpectedImpact(alert.type),
        evidence: [...alert.evidence],
        createdAt: insight.generatedAt
    }));
}


//* Ediciones de este archivo
// @luis-hdz7 el 01/7/2026 (creación y primera edición)