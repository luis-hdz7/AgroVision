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
    ndwi?: number;
    gndvi?: number;
    visualAnomalyDetected?: boolean;
    dryAreaDetected?: boolean;
    chlorosisDetected?: boolean;
    vegetationTrend?: number;
    mappingRiskDetected?: boolean;
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
        const evidence = EvidenceFusionService.buildEvidence({
            soilMoisturePercentage: data.soilMoisturePercentage,
            temperatureCelsius: data.temperatureCelsius,
            ndvi: data.ndvi,
            ndwi: data.ndwi,
            gndvi: data.gndvi,
            visualAnomalyDetected: data.visualAnomalyDetected,
            dryAreaDetected: data.dryAreaDetected,
            chlorosisDetected: data.chlorosisDetected,
            vegetationTrend: data.vegetationTrend,
            mappingRiskDetected: data.mappingRiskDetected
        });
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
        case "WATER_STRESS":
            return `Satellite, sensor and environmental evidence suggest conditions compatible with water stress. The zone should be prioritized for irrigation review and field inspection. Final risk level: ${riskLevel}.`;
        case "HEAT_STRESS":
            return `Weather indicators suggest elevated temperature conditions that may affect crop performance. Continued monitoring and mitigation measures should be considered. Final risk level: ${riskLevel}.`;
        case "LOW_VIGOR":
            return `Vegetation indices indicate reduced vigor compared to expected crop conditions. Further inspection is recommended to determine possible nutritional, environmental or water-related causes. Final risk level: ${riskLevel}.`;
        case "VISUAL_ANOMALY":
            return `Visual analysis identified patterns requiring additional verification. Field inspection is recommended to determine the origin and potential impact of the observed anomaly. Final risk level: ${riskLevel}.`;
        default:
            return `Current evidence indicates stable crop conditions with no significant anomalies detected. Continue standard monitoring procedures. Final risk level: ${riskLevel}.`;
    }
}
}
//*Ediciones de este archivo
//@luis-hdz7 el 29/6/2026 (creación y primera edición)