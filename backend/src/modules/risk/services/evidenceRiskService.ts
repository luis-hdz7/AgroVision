import { RiskLevel } from "../types/riskTypes";
import { EvidenceItem } from "../../analysis/services/evidenceFusionService";

export interface EvidenceRiskResult {
    mainCause: string;
    riskLevel: RiskLevel;
    criticalEvidence: EvidenceItem[];
    recommendedAction: string;
}

export class EvidenceRiskService {
    static evaluate(evidence: EvidenceItem[]): EvidenceRiskResult {

        const criticalEvidence = evidence.filter(item => item.status === "CRITICAL");

        const warningEvidence = evidence.filter(item => item.status === "WARNING");

        const waterStress = evidence.some(item =>
                item.metric === "soilMoisturePercentage" &&
                (item.status === "WARNING" || item.status === "CRITICAL"));

        const heatStress = evidence.some(item =>
                item.metric === "temperatureCelsius" &&
                (item.status === "WARNING" ||item.status === "CRITICAL"));

        const lowVigor = evidence.some(
            item =>item.metric === "ndvi" &&
                (item.status === "WARNING" ||item.status === "CRITICAL"));

        const visualAnomaly = evidence.some(
            item =>item.source === "VISION" &&
                (item.status === "WARNING" ||item.status === "CRITICAL"));

        const riskLevel = this.resolveRiskLevel(criticalEvidence.length,warningEvidence.length);

        const mainCause = this.resolveMainCause({
            waterStress,
            heatStress,
            lowVigor,
            visualAnomaly
        });

        const recommendedAction =this.resolveRecommendation(mainCause);

        return {
            mainCause,
            riskLevel,
            criticalEvidence,
            recommendedAction
        };
    }

    private static resolveRiskLevel(criticalCount: number,warningCount: number): RiskLevel {
        if (criticalCount >= 2) {
            return "HIGH";
        }
        if (criticalCount >= 1 ||warningCount >= 2) {
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
    ): string {
        if (causes.waterStress) {
            return "Water stress detected";
        }
        if (causes.heatStress) {
            return "Heat stress detected";
        }
        if (causes.lowVigor) {
            return "Low vegetation vigor detected";
        }
        if (causes.visualAnomaly) {
            return "Visual anomaly detected";
        }

        return "No significant agricultural risks detected";
    }

    private static resolveRecommendation(mainCause: string): string {
        switch (mainCause) {
            case "Water stress detected":
                return "Increase irrigation and inspect water distribution.";
            case "Heat stress detected":
                return "Monitor crop exposure and apply heat mitigation measures.";
            case "Low vegetation vigor detected":
                return "Inspect crop nutrition and vegetation health.";
            case "Visual anomaly detected":
                return "Perform field inspection to validate anomaly.";
            default:
                return "Continue normal monitoring.";
        }
    }
}


//*Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)