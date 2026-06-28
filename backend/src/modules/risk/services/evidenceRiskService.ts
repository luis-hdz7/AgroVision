import { RiskLevel } from "../types/riskTypes";
import { EvidenceItem } from "../../analysis/services/evidenceFusionService";

/*
    * Define el resultado de la evaluación de riesgo basada en evidencia.
*/
export interface EvidenceRiskResult {
    mainCause: string;
    riskLevel: RiskLevel;
    criticalEvidence: EvidenceItem[];
    recommendedAction: string;
}

/*
    * Servicio encargado de interpretar la evidencia fusionada y convertirla 
    * en una evaluación de riesgo accionable.
*/
export class EvidenceRiskService {

    static evaluate(evidence: EvidenceItem[]): EvidenceRiskResult {
        // 1. Filtrado de evidencia crítica y de advertencia
        const criticalEvidence = evidence.filter(item => item.status === "CRITICAL");
        const warningEvidence = evidence.filter(item => item.status === "WARNING");

        // 2. Identificación de causas raíz (Detección de estresores)
        const waterStress = evidence.some(item => 
            item.metric === "soilMoisturePercentage" && (item.status === "WARNING" || item.status === "CRITICAL"));
        const heatStress = evidence.some(item => 
            item.metric === "temperatureCelsius" && (item.status === "WARNING" || item.status === "CRITICAL"));

        const lowVigor = evidence.some(item => 
            item.metric === "ndvi" && (item.status === "WARNING" || item.status === "CRITICAL"));

        const visualAnomaly = evidence.some(item => 
            item.source === "VISION" && (item.status === "WARNING" || item.status === "CRITICAL"));

        // 3. Resolución de niveles de riesgo
        const riskLevel = this.resolveRiskLevel(criticalEvidence.length, warningEvidence.length);

        // 4. Determinación de causa principal y recomendación
        const mainCause = this.resolveMainCause({ waterStress, heatStress, lowVigor, visualAnomaly });
        const recommendedAction = this.resolveRecommendation(mainCause);

        return {
            mainCause,
            riskLevel,
            criticalEvidence,
            recommendedAction
        };
    }

    /*
        * Aplica la heurística de priorización para definir el nivel de riesgo.
    */
    private static resolveRiskLevel(criticalCount: number, warningCount: number): RiskLevel {
        if (criticalCount >= 2) return "HIGH"; // Múltiples críticos requieren atención urgente
        if (criticalCount >= 1 || warningCount >= 2) return "MEDIUM";
        return "LOW";
    }

    /*
        * Determina la causa principal siguiendo un orden de severidad agronómica.
    */
    private static resolveMainCause(causes: { waterStress: boolean; heatStress: boolean; lowVigor: boolean; visualAnomaly: boolean }): string {
        if (causes.waterStress) return "Water stress detected";
        if (causes.heatStress) return "Heat stress detected";
        if (causes.lowVigor) return "Low vegetation vigor detected";
        if (causes.visualAnomaly) return "Visual anomaly detected";
        return "No significant agricultural risks detected";
    }

    /*
        * Mapeo prescriptivo: conecta la causa con la solución sugerida.
        * Mejora: Se usa un objeto de mapeo para evitar sentencias switch largas.
    */
    private static resolveRecommendation(mainCause: string): string {
        const recommendations: Record<string, string> = {
            "Water stress detected": "Increase irrigation and inspect water distribution.",
            "Heat stress detected": "Monitor crop exposure and apply heat mitigation measures.",
            "Low vegetation vigor detected": "Inspect crop nutrition and vegetation health.",
            "Visual anomaly detected": "Perform field inspection to validate anomaly."
        };
        return recommendations[mainCause] || "Continue normal monitoring.";
    }
}

//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)