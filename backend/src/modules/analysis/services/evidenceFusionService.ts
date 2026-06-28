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

    static buildEvidence(data: EvidenceFusionInput): EvidenceItem[] {

        const evidence: EvidenceItem[] = [];

        /*
            * SENSOR
        */

        if (data.soilMoisturePercentage !== undefined) {

            const result =evaluateSoilMoisture(data.soilMoisturePercentage);

            evidence.push({
                source: "SENSOR",
                metric: result.factor.metric,
                value: result.factor.value,
                unit: result.factor.unit,
                status: result.factor.status,
                explanation: result.factor.explanation
            });
        }

        /*
            * WEATHER
        */

        if (data.temperatureCelsius !== undefined) {
            const result =evaluateTemperature(data.temperatureCelsius);
            evidence.push({
                source: "WEATHER",
                metric: result.factor.metric,
                value: result.factor.value,
                unit: result.factor.unit,
                status: result.factor.status,
                explanation: result.factor.explanation
            });
        }

        /*
            * SATELLITE (NDVI simulado)
        */

        if (data.ndvi !== undefined) {
            evidence.push({
                source: "SATELLITE",
                metric: "ndvi",
                value: data.ndvi,
                unit: null,
                status:
                    data.ndvi < 0.30
                        ? "CRITICAL"
                        : data.ndvi < 0.50
                            ? "WARNING"
                            : "NORMAL",
                explanation:
                    data.ndvi < 0.30
                        ? "Low vegetation vigor detected"
                        : data.ndvi < 0.50
                            ? "Vegetation vigor below expected range"
                            : "Vegetation vigor acceptable"
            });
        }

        /*
            * VISION
        */

        if (data.visualAnomalyDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "visualAnomaly",
                value: data.visualAnomalyDetected,
                unit: null,
                status:
                    data.visualAnomalyDetected
                        ? "WARNING"
                        : "NORMAL",
                explanation:
                    data.visualAnomalyDetected
                        ? "Visual anomaly detected during inspection"
                        : "No visual anomalies detected"
            });
        }

        /*
            * HISTORY
        */

        if (data.vegetationTrend !== undefined) {
            evidence.push({
                source: "HISTORY",
                metric: "vegetationTrend",
                value: data.vegetationTrend,
                unit: "%",
                status:
                    data.vegetationTrend <= -20
                        ? "WARNING"
                        : "NORMAL",
                explanation:
                    data.vegetationTrend <= -20
                        ? "Negative vegetation trend detected"
                        : "Vegetation trend remains stable"
            });
        }
        return evidence;
    }
}



//*Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)