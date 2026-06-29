import {EvidenceFusionService,EvidenceItem} from "./evidenceFusionService";

import {EvidenceRiskService} from "../../risk/services/evidenceRiskService";

import {RiskLevel} from "../../risk/types/riskTypes";

/*
    * Contrato central del análisis prescriptivo.
*/
export interface ZoneInsight {
    zoneId: string;
    fieldId: string;
    cropType: string;

    finalRiskLevel: RiskLevel;
    healthScore: number;

    evidence: EvidenceItem[];

    mainCause: string;

    summary: string;

    recommendedAction: string;

    generatedAt: string;
}

/*
    * Datos mínimos necesarios para construir un ZoneInsight.
*/
export interface ZoneInsightInput {
    zoneId: string;
    fieldId: string;
    cropType: string;
    /*
        * Resultado proveniente del motor de riesgo existente.
        * No debe recalcularse aquí.
    */
    healthScore: number;
    riskLevel: RiskLevel;
    /*
        * Evidencia multifuente.
    */
    soilMoisturePercentage?: number;
    temperatureCelsius?: number;

    ndvi?: number;

    visualAnomalyDetected?: boolean;

    vegetationTrend?: number;
}

/*
    * Servicio responsable de fusionar:
    *
    * riskEngine
    * + evidencia multifuente
    * + análisis prescriptivo
    *
    * para construir un ZoneInsight.
*/
export class ZoneInsightService {
    static buildInsight(data: ZoneInsightInput): ZoneInsight {
        // 1. Construir evidencia normalizada
        const evidence =EvidenceFusionService.buildEvidence({soilMoisturePercentage:data.soilMoisturePercentage,
                temperatureCelsius:data.temperatureCelsius,
                ndvi:data.ndvi,
                visualAnomalyDetected:data.visualAnomalyDetected,
                vegetationTrend:data.vegetationTrend});
        // 2. Evaluar riesgo prescriptivo
        const evidenceRisk =EvidenceRiskService.evaluate(evidence);
        // 3. Combinar riesgo tradicional + riesgo prescriptivo
        const finalRiskLevel =this.resolveFinalRisk(data.riskLevel,evidenceRisk.riskLevel);
        return {
            zoneId: data.zoneId,
            fieldId: data.fieldId,
            cropType: data.cropType,
            finalRiskLevel,
            healthScore:data.healthScore,
            evidence,
            mainCause:evidenceRisk.mainCause,
            summary:this.buildSummary(evidenceRisk.mainCause,finalRiskLevel),
            recommendedAction:evidenceRisk.recommendedAction,
            generatedAt:new Date().toISOString()
        };
    }

    /*
        * Conserva el riesgo más severo entre:
        *
        * - riskEngine
        * - evidenceRiskService
    */
    private static resolveFinalRisk(engineRisk: RiskLevel,evidenceRisk: RiskLevel): RiskLevel {
        const priority: Record<RiskLevel, number> = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3
        };

        return priority[evidenceRisk] >priority[engineRisk]? evidenceRisk: engineRisk;}

    /*
        * Genera un resumen ejecutivo para:
        * Dashboard
        * Alertas
        * Reportes
    */
    private static buildSummary(mainCause: string,riskLevel: RiskLevel): string {
        switch (mainCause) {
            case "WATER_STRESS":return `Water stress detected. Final risk level: ${riskLevel}.`;
            case "HEAT_STRESS":return `Heat stress indicators detected. Final risk level: ${riskLevel}.`;
            case "LOW_VIGOR":return `Low vegetation vigor detected through NDVI analysis.`;
            case "VISUAL_ANOMALY":return `Visual anomaly detected. Field inspection is recommended.`;
            default:return "No significant agricultural risks detected.";
        }
    }
}
/*
    TODO:
    !Migrar ZoneInsight y tipos prescriptivos
    a contracts/agrovisionIntelligence.contract.ts
    cuando el contrato oficial sea creado.
*/
//*Ediciones de este archivo
//@luis-hdz7 el 29/6/2026 (creación y primera edición)