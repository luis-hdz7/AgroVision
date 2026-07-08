import { CropType } from "../../crops/types/cropProfileTypes";
import { RiskLevel } from "../../risk/types/riskTypes";
import { EvidenceItem } from "../services/evidenceFusionService";
import { RiskAssessment } from "../../risk/types/riskTypes";
/*
    * Contrato central del análisis prescriptivo.
    * Representa el resultado final consumido por:
    *
    * - Dashboard
    * - Alertas
    * - Recomendaciones
*/
export interface ZoneInsight {
    readonly id: string;
    readonly zoneId: string;
    readonly fieldId: string;
    readonly cropType: CropType;
    /*
        * Riesgo final estimado después de combinar
        * el análisis heurístico y la evidencia multifuente.
    */
    readonly finalRiskLevel: RiskLevel;
    /*
        * Puntaje de salud proveniente del motor de riesgo.
    */
    readonly healthScore: number;
    /*
        * Evidencia utilizada para respaldar el análisis.
    */
    readonly evidence: readonly EvidenceItem[];
    /*
        * Principal causa estimada del riesgo.
    */
    readonly mainCause: string;
    /*
        * Resumen ejecutivo para Dashboard y Reportes.
    */
    readonly summary: string;
    /*
        * Acción sugerida basada en la evidencia disponible.
    */
    readonly recommendedAction: string;
    /*
        * Fecha de generación del análisis.
    */
    readonly generatedAt: string;
}

/*
    * Entrada utilizada por ZoneInsightService.
    * Recibe un RiskAssessment previamente calculado.
*/
export interface ZoneInsightInput {
    readonly id: string;
    readonly assessment: RiskAssessment;
}
