/*
    * Tipos de datos para el diagnóstico agrícola
    * Siguen las reglas de idioma técnico en inglés y valores explícitos definidos en el contrato[cite: 34, 372].
*/

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type HealthStatus =
    | "HEALTHY" | "WATCH" | "WARNING" | "CRITICAL" | "UNKNOWN";

export type FactorStatus =
    | "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";

export type AnalysisAnomalyType =
    | "VEGETATION_DROP" | "WATER_STRESS" | "HEAT_STRESS"
    | "SOIL_RISK" | "DISEASE_PATTERN" | "SENSOR_ANOMALY";

/*
    * Representa un factor individual (ej. humedad, pH, radiación)
    * que influye en la salud del cultivo.
*/
export interface AnalysisFactor {
    name: string;        // Nombre del factor (ej. "Soil Moisture")
    metric: string;      // Identificador técnico de la métrica
    value: number;       // Valor numérico actual
    unit: string;        // Unidad de medida clara según reglas [cite: 44]
    status: FactorStatus;// Estado evaluado del factor
    explanation: string; // Justificación cualitativa del estado
}

/*
    * Define una anomalía detectada en el análisis, 
    * esencial para identificar problemas accionables[cite: 370].
*/
export interface AnalysisAnomaly {
    type: AnalysisAnomalyType;    // Categoría de la anomalía
    severity: RiskLevel;          // Nivel de riesgo asociado
    description: string;          // Descripción técnica de la anomalía
}

/*
    * Interfaz principal del análisis de salud del cultivo.
    * Agrupa factores, anomalías y recomendaciones para un diagnóstico completo.
*/
export interface CropHealthAnalysis {
    cropId: string;
    fieldId: string;
    healthScore: number;          // Puntuación general de salud
    status: HealthStatus;         // Estado actual del cultivo
    riskLevel: RiskLevel;         // Nivel de riesgo general
    factors: AnalysisFactor[];    // Lista de factores que componen el análisis [cite: 372]
    anomalies: AnalysisAnomaly[]; // Lista de anomalías encontradas [cite: 370]
    summary: string;              // Resumen ejecutivo del diagnóstico
    recommendations: string[];    // Acciones sugeridas basadas en el análisis [cite: 371]
    generatedAt: string;          // Fecha/hora en formato ISO [cite: 51, 371]
}




//*Ediciones de este archivo
// @luis-hdz7 el 14/6/2026 (creacion y primera modificacion)