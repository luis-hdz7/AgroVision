import { buildRiskSummary } from "./riskSummaryService";
import { CropHealthAnalysis } from "../types/riskTypes";
import { RiskAssessment, RiskLevel } from "../types/riskTypes";
import { ZoneInsight } from "../../analysis/types/zoneInsightTypes";
export class RiskService {
    /*
     * Obtiene el resumen ejecutivo de riesgo para una parcela.
     *
     * Flujo:
     * 1. Recupera (o genera) el análisis del cultivo.
     * 2. Construye el resumen ejecutivo.
     * 3. Devuelve el resultado al controlador.
     *
     * @param fieldId Identificador único de la parcela.
     */

    public static buildRiskAssessmentFromZoneInsight(insight: ZoneInsight): RiskAssessment {
        return {
            fieldId: insight.fieldId,
            zoneId: insight.zoneId,
            cropType: insight.cropType,
            riskLevel: insight.finalRiskLevel,
            riskScore: this.calculateRiskScore(insight.finalRiskLevel,insight.healthScore),
            healthScore: insight.healthScore,
            mainCause: insight.mainCause,
            evidence: [...insight.evidence],
            recommendedAction: insight.recommendedAction,
            generatedAt: insight.generatedAt
        };
    }
    private static calculateRiskScore(riskLevel: RiskLevel,healthScore: number): number {
        const baseScores: Record<RiskLevel, number> = {
            LOW: 25,
            MEDIUM: 55,
            HIGH: 80,
            CRITICAL: 95
        };
        let score = baseScores[riskLevel];
        // Ajuste ligero utilizando el healthScore.
        if (healthScore < 40) {
            score += 5;
        } else if (healthScore > 85) {
            score -= 5;
        }
        return Math.max(0, Math.min(100, score));
    }
    public static getRiskByField(fieldId: string) {
        const analysis: CropHealthAnalysis = {
            cropId: "crop-001",
            fieldId,
            healthScore: 35,
            status: "CRITICAL",
            riskLevel: "HIGH",
            factors: [
                {
                    name: "NDVI",
                    metric: "ndvi",
                    value: 0.31,
                    unit: "",
                    status: "CRITICAL",
                    explanation: "Very low vegetation vigor detected."
                },
                {
                    name: "Soil Moisture",
                    metric: "soilMoisturePercentage",
                    value: 18,
                    unit: "%",
                    status: "WARNING",
                    explanation: "Low soil moisture."
                }
            ],
            anomalies: [
                {
                    type: "VEGETATION_DROP",
                    severity: "HIGH",
                    description: "Severe vegetation deterioration detected."
                }
            ],
            summary: "Crop health has significantly decreased due to low vegetation vigor.",
            recommendations: [
                "Inspect affected area immediately.",
                "Increase irrigation frequency.",
                "Validate crop condition with field inspection."
            ],
            generatedAt: new Date().toISOString()
        };
        //convierte el analisis detallado en un resumen
        return buildRiskSummary(analysis);
    }
}