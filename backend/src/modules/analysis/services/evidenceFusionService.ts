import {evaluateSoilMoisture,evaluateTemperature} from "../../risk/services/riskRulesService";

export type EvidenceSource =
    | "SENSOR"
    | "VISION"
    | "SATELLITE"
    | "WEATHER"
    | "HISTORY";

export type EvidenceStatus =
    | "NORMAL"
    | "WATCH"
    | "WARNING"
    | "CRITICAL";

export interface EvidenceItem {
    source: EvidenceSource;
    metric: string;
    value: number | string | boolean | null;
    unit?: string | null;
    status: EvidenceStatus;
    explanation: string;
}

type EvidenceFusionInput = {
    soilMoisturePercentage?: number;
    temperatureCelsius?: number;

    ndvi?: number;

    visualAnomalyDetected?: boolean;

    vegetationTrend?: number;
};

export class EvidenceFusionService {
    /*
        * Construye una lista normalizada de evidencias.
        * Refactor: Se extrajo la lógica de decisión de estatus para facilitar futuros ajustes.
    */
    static buildEvidence(data: EvidenceFusionInput): EvidenceItem[] {
        const evidence: EvidenceItem[] = [];

        // 1. SENSOR: Humedad (reutiliza motor heurístico V0)
        if (data.soilMoisturePercentage !== undefined) {
            const result = evaluateSoilMoisture(data.soilMoisturePercentage);
            evidence.push({
                source: "SENSOR",
                metric: result.factor.metric,
                value: result.factor.value,
                unit: result.factor.unit,
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        // 2. WEATHER: Temperatura (reutiliza motor heurístico V0)
        if (data.temperatureCelsius !== undefined) {
            const result = evaluateTemperature(data.temperatureCelsius);
            evidence.push({
                source: "WEATHER",
                metric: result.factor.metric,
                value: result.factor.value,
                unit: result.factor.unit,
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        // 3. SATELLITE: NDVI
        if (data.ndvi !== undefined) {
            //lógica encapsulada para facilitar cambios de umbral
            const ndviStatus = data.ndvi < 0.30 ? "CRITICAL" : data.ndvi < 0.50 ? "WARNING" : "NORMAL";
            evidence.push({
                source: "SATELLITE",
                metric: "ndvi",
                value: data.ndvi,
                unit: null,
                status: ndviStatus,
                explanation: ndviStatus === "CRITICAL" ? "Low vegetation vigor" :ndviStatus === "WARNING" ? "Vigor below range" : "Vigor acceptable"
            });
        }

        // 4. VISION: Anomalías
        if (data.visualAnomalyDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "visualAnomaly",
                value: data.visualAnomalyDetected,
                status: data.visualAnomalyDetected ? "WARNING" : "NORMAL",
                explanation: data.visualAnomalyDetected ? "Anomaly detected" : "No anomalies"
            });
        }

        // 5. HISTORY: Tendencia
        if (data.vegetationTrend !== undefined) {
            evidence.push({
                source: "HISTORY",
                metric: "vegetationTrend",
                value: data.vegetationTrend,
                unit: "%",
                status: data.vegetationTrend <= -20 ? "WARNING" : "NORMAL",
                explanation: data.vegetationTrend <= -20 ? "Negative trend" : "Stable trend"
            });
        }
        return evidence;
    }
}

//*Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)