import {CropHealthAnalysis,RiskLevel,HealthStatus} from "../types/riskTypes";
import {
    evaluateSoilMoisture,
    evaluateTemperature,
    evaluateCropHealth} from "../services/riskRulesService";
type CalculateRiskInput = {
    cropId:string;
    fieldId:string;
    soilMoisturePercentage:number;
    temperatureCelsius:number;
    cropHealthScore:number;
};
export function calculateRisk(data:CalculateRiskInput):CropHealthAnalysis{
    const {
        cropId,
        fieldId,
        soilMoisturePercentage,
        temperatureCelsius,
        cropHealthScore}=data;
    let score=cropHealthScore;
    const results=[
        evaluateSoilMoisture(
            soilMoisturePercentage
        ),
        evaluateTemperature(
            temperatureCelsius
        ),
        evaluateCropHealth(
            cropHealthScore
        )
    ];
    const factors=[];
    const anomalies=[];
    const recommendations=[];
    for(const result of results){
        score-=result.penalty;
        factors.push(result.factor);
        if(result.anomaly){
            anomalies.push(result.anomaly);
        }
        if(result.recommendation){
            recommendations.push(result.recommendation);
        }
    }
    score=Math.max(0,Math.min(100,score));
    const riskLevel:RiskLevel=score<40? "HIGH": score<70? "MEDIUM": "LOW";
    return{
        cropId,
        fieldId,
        healthScore:score,
        status:
            resolveStatus(score),
        riskLevel,
        factors,
        anomalies,
        summary:
            anomalies.length===0?"Crop conditions are stable.":"Agricultural risk detected.",
        recommendations,
        generatedAt:new Date().toISOString()
    };
}
function resolveStatus(score:number):HealthStatus{
    if(score<25){
        return "CRITICAL";
    }
    if(score<50){
        return "WARNING";
    }
    if(score<75){
        return "WATCH";
    }
    return "HEALTHY";
}
//*Ediciones de este archivo
// @luis-hdz7 el 14/6/2026 (creacion y primera edicion)
// @luis-hdz7 el 16/6/2026 (refactor usando riskRulesService)
