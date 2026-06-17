export type RiskLevel =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export type HealthStatus =
    | "HEALTHY"
    | "WATCH"
    | "WARNING"
    | "CRITICAL"
    | "UNKNOWN";

export type FactorStatus =
    | "NORMAL"
    | "WATCH"
    | "WARNING"
    | "CRITICAL";

export type AnalysisAnomalyType =
    | "VEGETATION_DROP"
    | "WATER_STRESS"
    | "HEAT_STRESS"
    | "SOIL_RISK"
    | "DISEASE_PATTERN"
    | "SENSOR_ANOMALY";


export interface AnalysisFactor {
    name: string;
    metric: string;
    value: number;
    unit: string;
    status: FactorStatus;
    explanation: string;
}
export interface AnalysisAnomaly {
    type: AnalysisAnomalyType;
    severity: RiskLevel;
    description: string;
}


export interface CropHealthAnalysis {
    cropId: string;
    fieldId: string;
    healthScore: number;
    status: HealthStatus;
    riskLevel: RiskLevel;
    factors: AnalysisFactor[];
    anomalies: AnalysisAnomaly[];
    summary: string;
    recommendations: string[];
    generatedAt: string;
}





//*Ediciones de este archivo
// @luis-hdz7 el 14/6/2026 (creacion y primera modificacion)