import {CropHealthAnalysis,RiskLevel,HealthStatus} from "./riskTypes";
export interface RiskSummary {
    cropId:string;
    fieldId:string;
    healthScore:number;
    status:HealthStatus;
    riskLevel:RiskLevel;
    mainProblem:string | null;
    criticalFactors:string[];
    recommendedActions:string[];
    generatedAt:string;
}
export type BuildRiskSummaryInput=|CropHealthAnalysis;

//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creacion y primera edicion)