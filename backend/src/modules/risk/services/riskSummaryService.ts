import {CropHealthAnalysis} from "../types/riskTypes";
import {RiskSummary} from "../types/riskSummaryTypes";

export function buildRiskSummary(analysis:CropHealthAnalysis):RiskSummary{
    const criticalFactors=analysis.factors.filter(factor=>factor.status==="WARNING" ||factor.status==="CRITICAL")
        .map(factor=>factor.name);
    const mainProblem=analysis.anomalies.length>0? analysis.anomalies[0].description: null;
    return{
        cropId:analysis.cropId,
        fieldId:analysis.fieldId,
        healthScore:analysis.healthScore,
        status:analysis.status,
        riskLevel:analysis.riskLevel,
        mainProblem,
        criticalFactors,
        recommendedActions:analysis.recommendations,
        generatedAt:analysis.generatedAt
    };
}

//*Ediciones de este archivo
// @luis-hdz7 el 18/6/2026 (creacion y primera edicion)