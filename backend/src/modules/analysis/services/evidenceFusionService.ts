/*
    * EVIDENCE FUSION SERVICE
    * Objetivo: Actuar como capa de normalización y transformación.
    * Recibe datos heterogéneos (sensores, satélite, visión, clima, historial)
    * y los convierte en objetos 'EvidenceItem' unificados para el motor prescriptivo.
*/

import { evaluateSoilMoisture, evaluateTemperature } from "../../risk/services/riskRulesService";

// Tipos de fuentes de datos permitidas
export type EvidenceSource =
    | "SENSOR"
    | "VISION"
    | "SATELLITE"
    | "WEATHER"
    | "HISTORY";

// Niveles de severidad normalizados para el dashboard prescriptivo
export type EvidenceStatus =
    | "NORMAL"
    | "WATCH"
    | "WARNING"
    | "CRITICAL";

export interface EvidenceItem {
    source: EvidenceSource;
    metric: string;
    value?: number | string | boolean | null;
    unit?: string | null;
    status: EvidenceStatus;
    explanation: string;
}

export interface EvidenceFusionInput {
    soilMoisturePercentage?: number;
    temperatureCelsius?: number;
    ndvi?: number;
    visualAnomalyDetected?: boolean;
    vegetationTrend?: number;
}

export class EvidenceFusionService {

    /*
        * Procesa entradas multifuente y genera una lista de evidencias normalizadas.
        * Es el punto de entrada principal para convertir datos brutos en insights.
    */
    static buildEvidence(data: EvidenceFusionInput): EvidenceItem[] {
        const evidence: EvidenceItem[] = [];

        //* 1. PROCESAMIENTO DE SENSORES (Humedad)
        // Utiliza reglas de riesgo compartidas para consistencia
        if (data.soilMoisturePercentage !== undefined) {
            const result = evaluateSoilMoisture(data.soilMoisturePercentage);
            evidence.push({
                source: "SENSOR",
                metric: "soilMoisturePercentage",
                value: data.soilMoisturePercentage,
                unit: "%",
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        //* 2. PROCESAMIENTO CLIMÁTICO (Temperatura)
        // Similar a sensores, delega la lógica de umbrales a riskRulesService
        if (data.temperatureCelsius !== undefined) {
            const result = evaluateTemperature(data.temperatureCelsius);
            evidence.push({
                source: "WEATHER",
                metric: "temperatureCelsius",
                value: data.temperatureCelsius,
                unit: "°C",
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        //* 3. PROCESAMIENTO SATELITAL (NDVI)
        // Lógica propia de vigor vegetal mediante método privado
        if (data.ndvi !== undefined) {
            const status = this.evaluateNdvi(data.ndvi);
            evidence.push({
                source: "SATELLITE",
                metric: "ndvi",
                value: data.ndvi,
                status,
                explanation:status === "CRITICAL"
                ? "Very low vegetation vigor detected."
                : status === "WARNING"
                ? "Vegetation vigor below expected range."
                : "Vegetation vigor within acceptable range."
            });
        }

        //* 4. PROCESAMIENTO DE VISIÓN (IA/Cámaras)
        // Evaluación binaria de anomalías visuales
        if (data.visualAnomalyDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "visualAnomaly",
                value: data.visualAnomalyDetected,
                status: data.visualAnomalyDetected ? "WARNING" : "NORMAL",
                explanation: data.visualAnomalyDetected 
                    ? "Visual anomaly detected." 
                    : "No visual anomalies detected."
            });
        }

        // 5. PROCESAMIENTO DE HISTORIAL (Tendencias)
        // Evaluación de series temporales basada en umbral fijo (-20%)
        if (data.vegetationTrend !== undefined) {
            evidence.push({
                source: "HISTORY",
                metric: "vegetationTrend",
                value: data.vegetationTrend,
                unit: "%",
                status: data.vegetationTrend <= -20 ? "WARNING" : "NORMAL",
                explanation: data.vegetationTrend <= -20
                        ? "Negative vegetation trend detected."
                        : "Vegetation trend remains stable."
            });
        }

        return evidence;
    }

    /*
        * Helper privado para clasificar el estado de salud basado en el NDVI.
        ! Si los umbrales cambian en el futuro, actualizar aquí.
    */
    private static evaluateNdvi(ndvi: number): EvidenceStatus {
        if (ndvi < 0.30) return "CRITICAL";
        if (ndvi < 0.50) return "WARNING";
        if (ndvi < 0.70) return "WATCH";
        return "NORMAL";
    }
}


//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)
// @luis-hdz7 el 29/06/2026 (realizando pequeños ajustes)
