/*
    * EVIDENCE RISK SERVICE
    * Objetivo:
    * Transformar evidencia multifuente en:
    - mainCause
    - riskLevel
    - recommendedAction
    * evitando diagnósticos definitivos.
*/

import { RiskLevel } from "../types/riskTypes";
import { EvidenceItem } from "../../analysis/services/evidenceFusionService";

export type MainCause =
    | "WATER_STRESS"
    | "LOW_VIGOR"
    | "HEAT_STRESS"
    | "VISUAL_ANOMALY"
    | "NONE";

export interface EvidenceRiskResult {
    mainCause: MainCause;
    riskLevel: RiskLevel;
    criticalEvidence: EvidenceItem[];
    recommendedAction: string;
}
export class EvidenceRiskService {
    static evaluate(evidence: EvidenceItem[]): EvidenceRiskResult {
        const criticalEvidence = evidence.filter(
            item => item.status === "CRITICAL"
        );
        const warningEvidence = evidence.filter(
            item => item.status === "WARNING"
        );

        /*
            * Señales compatibles con estrés hídrico
        */

        const waterStress =
            evidence.some(
                item =>
                    item.metric === "soilMoisturePercentage" &&
                    (item.status === "WARNING" ||
                        item.status === "CRITICAL")
            ) ||
            evidence.some(
                item =>
                    item.metric === "ndwi" &&
                    (item.status === "WARNING" ||
                        item.status === "CRITICAL")
            );
        /*
            * Estrés térmico
        */

        const heatStress = evidence.some(
            item =>
                item.metric === "temperatureCelsius" &&
                (item.status === "WARNING" ||
                    item.status === "CRITICAL")
        );
        /*
            * Bajo vigor vegetal
        */

        const lowVigor =evidence.some(
                item =>
                    item.metric === "ndvi" &&
                    (item.status === "WARNING" ||
                        item.status === "CRITICAL")
            ) ||
            evidence.some(
                item =>
                    item.metric === "gndvi" &&
                    (item.status === "WARNING" ||
                        item.status === "CRITICAL")
            ) ||
            evidence.some(
                item =>
                    item.metric === "chlorosisDetected" &&
                    item.status === "WARNING"
            );

        /*
            * Anomalías visuales
        */
        const visualAnomaly =
            evidence.some(
                item =>
                    item.metric === "visualAnomaly" &&
                    item.status === "WARNING"
            ) ||
            evidence.some(
                item =>
                    item.metric === "dryAreaDetected" &&
                    item.status === "WARNING"
            );
        /*
            * Mapping
        */
        const mappingRisk = evidence.some(
            item =>
                item.metric === "mappingRiskDetected" &&
                item.status === "WARNING"
        );
        const riskLevel = this.resolveRiskLevel(
            criticalEvidence.length,
            warningEvidence.length,
            mappingRisk
        );
        const mainCause = this.resolveMainCause({
            waterStress,
            heatStress,
            lowVigor,
            visualAnomaly
        });
        return {
            mainCause,
            riskLevel,
            criticalEvidence:
                criticalEvidence.length > 0
                    ? criticalEvidence
                    : warningEvidence,
            recommendedAction:this.resolveRecommendation(mainCause)
        };
    }

    private static resolveRiskLevel(
        criticalCount: number,
        warningCount: number,
        mappingRisk: boolean): RiskLevel {
        let score = 0;
        score += criticalCount * 2;
        score += warningCount;
        if (mappingRisk) {
            score += 1;
        }
        if (score >= 4) {
            return "HIGH";
        }
        if (score >= 1) {
            return "MEDIUM";
        }
        return "LOW";
    }
    private static resolveMainCause(
        causes: {
            waterStress: boolean;
            heatStress: boolean;
            lowVigor: boolean;
            visualAnomaly: boolean;
        }
    ): MainCause {
        /*
            * Prioridad:
            * Agua > Calor > Vigor > Visual
        */

        if (causes.waterStress) {
            return "WATER_STRESS";
        }
        if (causes.heatStress) {
            return "HEAT_STRESS";
        }
        if (causes.lowVigor) {
            return "LOW_VIGOR";
        }
        if (causes.visualAnomaly) {
            return "VISUAL_ANOMALY";
        }
        return "NONE";
    }

    private static resolveRecommendation(cause: MainCause): string {
        const actions: Record<MainCause,string> = {
            WATER_STRESS:"Inspect irrigation coverage and verify soil moisture conditions.",
            HEAT_STRESS:"Monitor temperature conditions and evaluate mitigation measures.",
            LOW_VIGOR:"Inspect crop vigor and evaluate possible nutritional limitations.",
            VISUAL_ANOMALY:"Perform a field inspection to validate the detected visual patterns.",
            NONE:"Continue routine monitoring."
        };
        return actions[cause];
    }
}
//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)
// @luis-hdz7 el 29/06/2026 (realizando pequeños ajustes)
// @luis-hdz7 el 03/07/2026