import {
    ZoneInsight,
    ZoneInsightInput
} from "../types/zoneInsightTypes";
import { CropType } from "../../crops/types/cropProfileTypes";
import { RiskLevel } from "../../risk/types/riskTypes";

/*
    * Servicio responsable de transformar un RiskAssessment
    * en un ZoneInsight consumible por:
    *
    * - Dashboard
    * - Alertas
    * - Recomendaciones
*/
export class ZoneInsightService {

    static buildInsight(
        data: ZoneInsightInput
    ): ZoneInsight {

        const { assessment } = data;

        return {
            id: data.id,

            zoneId: assessment.zoneId,

            fieldId: assessment.fieldId,

            cropType: assessment.cropType,

            finalRiskLevel: assessment.riskLevel,

            healthScore: assessment.healthScore,

            evidence: assessment.evidence,

            mainCause: assessment.mainCause,

            summary: this.buildSummary(
                assessment.mainCause,
                assessment.riskLevel
            ),

            recommendedAction:
                assessment.recommendedAction,

            generatedAt:
                assessment.generatedAt
        };
    }

    /*
        * Genera un resumen ejecutivo para:
        * Dashboard
        * Alertas
        * Reportes
    */
    private static buildSummary(
        mainCause: string,
        riskLevel: RiskLevel
    ): string {

        switch (mainCause) {

            case "WATER_STRESS":
                return `Available evidence suggests conditions compatible with water stress. Technical field inspection and irrigation review are recommended. Final estimated risk level: ${riskLevel}.`;

            case "HEAT_STRESS":
                return `Environmental indicators suggest possible heat stress affecting crop performance. Continued monitoring is recommended. Final estimated risk level: ${riskLevel}.`;

            case "LOW_VIGOR":
                return `Vegetation indices suggest reduced crop vigor. Technical inspection is recommended to determine the underlying cause. Final estimated risk level: ${riskLevel}.`;

            case "VISUAL_ANOMALY":
                return `Visual evidence indicates patterns requiring field verification. Technical inspection is recommended. Final estimated risk level: ${riskLevel}.`;

            default:
                return `Current evidence does not indicate significant agricultural risks. Continue routine monitoring.`;
        }
    }
}
