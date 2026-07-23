import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
import { CropProfile } from "../../crops/types/cropProfileTypes";
import { AgriculturalAlert } from "../../alerts/types/alertsTypes";
import {
    Recommendation,
    RecommendationPriority,
    ExpectedImpact
} from "../types/recommendationTypes";

/*
    * Convierte el nivel de riesgo en prioridad de recomendación.
*/
function mapPriority(
    riskLevel: ZoneInsight["finalRiskLevel"]
): RecommendationPriority {

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
function getExpectedImpact(
    alertType: AgriculturalAlert["type"]
): ExpectedImpact {

    switch (alertType) {

        case "WATER_STRESS":
            return {
                impactArea: "WATER_SAVING",
                description:
                    "Reduce the potential impact of water stress through timely irrigation adjustments."
            };

        case "LOW_VIGOR":
            return {
                impactArea: "CROP_HEALTH",
                description:
                    "Supports recovery of vegetation vigor through early intervention."
            };

        case "HEAT_STRESS":
            return {
                impactArea: "YIELD_PROTECTION",
                description:
                    "Helps reduce the potential effects of prolonged heat exposure."
            };

        case "VISUAL_ANOMALY":
            return {
                impactArea: "DISEASE_PREVENTION",
                description:
                    "Allows early validation of visual anomalies before they progress."
            };

        default:
            return {
                impactArea: "CROP_HEALTH",
                description:
                    "Supports continuous crop monitoring."
            };
    }
}

/*
    * Obtiene la acción sugerida.
    * Si existe un CropProfile se utilizan sus plantillas.
    * En caso contrario se utiliza la acción sugerida por ZoneInsight.
*/
function resolveSuggestedAction(
    alert: AgriculturalAlert,
    insight: ZoneInsight,
    cropProfile?: CropProfile
): string {

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

        case "HEAT_STRESS":
            return insight.recommendedAction;

        default:
            return insight.recommendedAction;
    }
}

/*
 * Construye la razón prescriptiva de la recomendación.
 * Se reutiliza el análisis generado por ZoneInsight para
 * mantener consistencia entre riesgo, alertas y recomendaciones.
 */
function buildReason(insight: ZoneInsight,_alert: AgriculturalAlert): string {
    return `${insight.mainCause} Field verification is recommended before applying corrective actions.`;
}

/*
    * Generador principal de recomendaciones.
    * Cada alerta genera una recomendación respaldada por evidencia.
*/
export function generateRecommendations(
    insight: ZoneInsight,
    alerts: AgriculturalAlert[],
    cropProfile?: CropProfile
): Recommendation[] {

    return alerts.map(alert => ({

        id: `rec-${insight.zoneId}-${alert.type.toLowerCase()}`,
        fieldId: insight.fieldId,
        zoneId: insight.zoneId,
        priority: mapPriority(insight.finalRiskLevel),
        reason: buildReason(
            insight,
            alert
        ),

        suggestedAction: resolveSuggestedAction(
            alert,
            insight,
            cropProfile,
        ),

        expectedImpact: getExpectedImpact(alert.type),

        evidence: [...alert.evidence],

        createdAt: insight.generatedAt

    }));
}

/*
    * Ediciones de este archivo
*/
// @luis-hdz7 el 01/07/2026 (creación y primera edición)
// @luis-hdz7 el 08/07/2026 (alineación con arquitectura prescriptiva basada en ZoneInsight)