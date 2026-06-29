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

    static buildEvidence(data: EvidenceFusionInput): EvidenceItem[] {
        const evidence: EvidenceItem[] = [];
        if (data.soilMoisturePercentage !== undefined) {

            const result =evaluateSoilMoisture(data.soilMoisturePercentage);

            evidence.push({
                source: "SENSOR",
                metric: "soilMoisturePercentage",
                value: data.soilMoisturePercentage,
                unit: "%",
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        if (data.temperatureCelsius !== undefined) {
            const result =evaluateTemperature(data.temperatureCelsius);

            evidence.push({
                source: "WEATHER",
                metric: "temperatureCelsius",
                value: data.temperatureCelsius,
                unit: "°C",
                status: result.factor.status as EvidenceStatus,
                explanation: result.factor.explanation
            });
        }

        if (data.ndvi !== undefined) {
            const status =this.evaluateNdvi(data.ndvi);

            evidence.push({
                source: "SATELLITE",
                metric: "ndvi",
                value: data.ndvi,
                status,
                explanation:
                    status === "CRITICAL"
                        ? "Very low vegetation vigor detected."
                        : status === "WARNING"
                        ? "Vegetation vigor below expected range."
                        : "Vegetation vigor within acceptable range."
            });
        }

        if (data.visualAnomalyDetected !== undefined) {

            evidence.push({
                source: "VISION",
                metric: "visualAnomaly",
                value: data.visualAnomalyDetected,
                status:data.visualAnomalyDetected? "WARNING": "NORMAL",
                explanation:data.visualAnomalyDetected? "Visual anomaly detected.": "No visual anomalies detected."
            });
        }

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
                        ? "Negative vegetation trend detected."
                        : "Vegetation trend remains stable."
            });
        }
        return evidence;
    }

    private static evaluateNdvi(ndvi: number): EvidenceStatus {
        if (ndvi < 0.30) {
            return "CRITICAL";
        }
        if (ndvi < 0.50) {
            return "WARNING";
        }
        return "NORMAL";
    }
}



//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)
// @luis-hdz7 el 29/06/2026 (realizando pequeños ajustes)