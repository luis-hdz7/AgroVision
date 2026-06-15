import {CropHealthAnalysis,AnalysisFactor,AnalysisAnomaly,RiskLevel,HealthStatus,FactorStatus} from "../types/riskTypes";

type CalculateRiskInput = {
    cropId: string;
    fieldId: string;
    soilMoisturePercentage: number;
    temperatureCelsius: number;
    cropHealthScore: number;
};

export function calculateRisk(data: CalculateRiskInput): CropHealthAnalysis {
    const {cropId,fieldId,soilMoisturePercentage,temperatureCelsius,cropHealthScore} = data;
    const factors: AnalysisFactor[] = [];
    const anomalies: AnalysisAnomaly[] = [];
    const recommendations: string[] = [];
    let score = cropHealthScore;
    function registerFactor(
        factor: AnalysisFactor,
        penalty: number = 0
    ) {
        factors.push(factor);
        score -= penalty;
    }
    function registerAnomaly(
        anomaly: AnalysisAnomaly
    ) {
        anomalies.push(anomaly);
    }

    //* HUMEDAD DEL SUELO

    if (soilMoisturePercentage < 30) {
        registerFactor({
            name: "Soil Moisture",
            metric: "soilMoisturePercentage",
            value: soilMoisturePercentage,
            unit: "%",
            status: "CRITICAL",
            explanation:"Soil moisture below recommended threshold"
        }, 20);

        registerAnomaly({
            type: "WATER_STRESS",
            severity: "HIGH",
            description:"Low soil moisture detected"
        });

        recommendations.push(
            "Increase irrigation frequency"
        );

    } else {
        registerFactor({
            name: "Soil Moisture",
            metric: "soilMoisturePercentage",
            value: soilMoisturePercentage,
            unit: "%",
            status: "NORMAL",
            explanation:"Soil moisture within acceptable range"
        });
    }

    //* TEMPERATURA

    if (temperatureCelsius > 35) {
        registerFactor({
            name: "Temperature",
            metric: "temperatureCelsius",
            value: temperatureCelsius,
            unit: "°C",
            status: "WARNING",
            explanation:"Heat stress conditions detected"}, 15);
        registerAnomaly({
            type: "HEAT_STRESS",
            severity: "MEDIUM",
            description:"Crop exposed to elevated temperatures"});
        recommendations.push(
            "Inspect heat mitigation strategy"
        );
    } else {
        registerFactor({
            name: "Temperature",
            metric: "temperatureCelsius",
            value: temperatureCelsius,
            unit: "°C",
            status: "NORMAL",
            explanation:
                "Temperature stable"
        });
    }

    //* SALUD DEL CULTIVO
    if (cropHealthScore < 50) {
        registerFactor({
            name: "Crop Health",
            metric: "cropHealthScore",
            value: cropHealthScore,
            unit: "score",
            status: "CRITICAL",
            explanation:
                "Crop health score too low"
        }, 25);
        registerAnomaly({
            type: "VEGETATION_DROP",
            severity: "HIGH",
            description:
                "General crop health deterioration"
        });
        recommendations.push(
            "Schedule field inspection"
        );
    } else {
        registerFactor({
            name: "Crop Health",
            metric: "cropHealthScore",
            value: cropHealthScore,
            unit: "score",
            status: "NORMAL",
            explanation:
                "Crop health acceptable"
        });
    }
    score = Math.max(0, Math.min(100, score));
    let riskLevel: RiskLevel = "LOW";
    if (score < 40) {
        riskLevel = "HIGH";
    }
    else if (score < 70) {
        riskLevel = "MEDIUM";
    }
    const statusMap: Record<
        RiskLevel,
        HealthStatus
    > = {
        LOW: "HEALTHY",
        MEDIUM: "WATCH",
        HIGH: "WARNING"
    };
    return {
        cropId,
        fieldId,
        healthScore: score,
        status: statusMap[riskLevel],
        riskLevel,
        factors,
        anomalies,
        summary:anomalies.length === 0 ? "Crop conditions are stable.": "Agricultural risk detected.",
        recommendations,
        generatedAt:
            new Date().toISOString()
    };
}

/*const SOIL_PENALTY = 20;
const HEAT_PENALTY = 15;
const HEALTH_PENALTY = 25;*/
//*Ediciones de este archivo
// @luis-hdz7 el 14/6/2026
