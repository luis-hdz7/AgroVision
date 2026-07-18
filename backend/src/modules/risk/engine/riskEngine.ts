import { CropHealthAnalysis, RiskLevel, HealthStatus,RiskAssessment } from "../types/riskTypes";
import {evaluateSoilMoisture,evaluateTemperature,evaluateCropHealth} from "../services/riskRulesService";
import {EvidenceRiskService} from "../services/evidenceRiskService"
import { CropType } from "../../crops/types/cropProfileTypes";
import {EvidenceItem,EvidenceStatus} from "../../analysis/types/evidenceTypes";
import { EVIDENCE_PENALTIES } from "./evidenceThresholds";
    //* Entradas requeridas para el motor de análisis de riesgo.

export interface CalculateRiskInput {
    cropId: string;
    fieldId: string;
    soilMoisturePercentage: number;
    temperatureCelsius: number;
    cropHealthScore: number;
}

/*
    * Motor de evaluación heurística de AgroVision.
    * Procesa las condiciones actuales del cultivo y aplica penalizaciones basadas 
    * en el modelo de evaluación V0.
    * * Flujo:
    * 1. Calcula el impacto individual de cada factor (Humedad, Temperatura, Salud).
    * 2. Reduce el score base según las penalizaciones detectadas.
    * 3. Determina el nivel de riesgo y estado de salud final.
*/
export function calculateRisk(data: CalculateRiskInput): CropHealthAnalysis {
    const {
        cropId,
        fieldId,
        soilMoisturePercentage,
        temperatureCelsius,
        cropHealthScore
    } = data;

    let score = cropHealthScore;

    // Ejecución de reglas heurísticas
    const results = [
        evaluateSoilMoisture(soilMoisturePercentage),
        evaluateTemperature(temperatureCelsius),
        evaluateCropHealth(cropHealthScore)
    ];

    const factors: CropHealthAnalysis["factors"] = [];
    const anomalies: CropHealthAnalysis["anomalies"] = [];
    const recommendations: CropHealthAnalysis["recommendations"] = [];

    // Acumulación de penalizaciones y hallazgos
    for (const result of results) {
        score -= result.penalty;
        factors.push(result.factor);

        if (result.anomaly) {
            anomalies.push(result.anomaly);
        }
        if (result.recommendation) {
            recommendations.push(result.recommendation);
        }
    }

    // Restricción: 0 <= healthScore <= 100
    score = Math.max(0, Math.min(100, score));

    // Clasificación de riesgo según Score
    const riskLevel: RiskLevel = score < 40 ? "HIGH" : score < 70 ? "MEDIUM" : "LOW";

    return {
        cropId,
        fieldId,
        healthScore: score,
        status: resolveStatus(score), // Mapeo de score a estado
        riskLevel,
        factors,
        anomalies,
        summary: buildSummary(anomalies),
        recommendations,
        generatedAt: new Date().toISOString() // Formato ISO obligatorio [cite: 51]
    };
}

/*
    * Mapea el puntaje final a un estado descriptivo.
    * Sigue la tabla de conversión de score a estado de la versión V0.
*/
function resolveStatus(score: number): HealthStatus {
    if (score < 25) return "CRITICAL";
    if (score < 50) return "WARNING";
    if (score < 75) return "WATCH";
    return "HEALTHY";
}
/*
    * Genera un resumen ejecutivo basado en las anomalías detectadas.
*/
function buildSummary(anomalies: CropHealthAnalysis["anomalies"]): string {
    if (anomalies.length === 0) {
        return "Crop conditions are stable.";
    }
    const anomalyTypes = [...new Set(anomalies.map(a => a.type))];
    return `Agricultural risk detected due to ${anomalyTypes.join(", ").toLowerCase()}.`;
}

/*
    *Esta funcion resume el estado de la evidencia
    !no calcula riesgo
*/
export function evaluateEvidenceStatus(evidence: EvidenceItem[]): EvidenceStatus {
    if (evidence.some(item => item.status === "CRITICAL")) {
        return "CRITICAL";
    }
    if (evidence.some(item => item.status === "WARNING")) {
        return "WARNING";
    }
    if (evidence.some(item => item.status === "WATCH")) {
        return "WATCH";
    }
    return "NORMAL";
}

/*
    *En esta funcion se calcula el riesgo utilizando la evidencia multifuente
*/
export function calculateRiskFromEvidence(evidence: EvidenceItem[]): {
    riskLevel: RiskLevel;
    riskScore: number;
} {
    let score = 100;
    for (const item of evidence) {
        score -= EVIDENCE_PENALTIES[item.status];
    }
    score = Math.max(0, score);
    const riskLevel: RiskLevel =score < 40
        ? "HIGH": score < 70
        ? "MEDIUM": "LOW";
    return {
        riskLevel,
        riskScore: score
    };
}

/*
    *Generar el contrato
*/
export function buildRiskAssessment(
    analysis: CropHealthAnalysis,
    zoneId: string,
    cropType: CropType,
    evidence: EvidenceItem[]
): RiskAssessment {
    const evidenceRisk = EvidenceRiskService.evaluate(evidence);
    return {
        fieldId: analysis.fieldId,
        zoneId,
        cropType,
        riskLevel: evidenceRisk.riskLevel,
        riskScore: evidenceRisk.riskScore,
        healthScore: analysis.healthScore,
        mainCause: evidenceRisk.mainCause,
        evidence,
        recommendedAction: evidenceRisk.recommendedAction,
        generatedAt: analysis.generatedAt
    };
}
    /* Ediciones de este archivo
    * @luis-hdz7 el 14/6/2026 (creación y primera edición)
    * @luis-hdz7 el 16/6/2026 (refactor usando riskRulesService)
    * @luis-hdz7 el 26/6/2026 (documentación técnica basada en Risk Rules V0)
    * @luis-hdz7 el 8/7/2026
*/