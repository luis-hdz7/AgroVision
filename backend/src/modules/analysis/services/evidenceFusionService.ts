/*
    * EVIDENCE FUSION SERVICE
    * Objetivo:
    * Normalizar evidencia proveniente de:
    SENSOR
    WEATHER
    SATELLITE
    VISION
    HISTORY
    MAPPING
    * para construir una colección uniforme de EvidenceItem.
*/

import {evaluateSoilMoisture,evaluateTemperature} from "../../risk/services/riskRulesService";
import {EvidenceItem,EvidenceStatus,EvidenceSource} from "../types/evidenceTypes";

export interface EvidenceFusionInput {
    // SENSOR
    soilMoisturePercentage?: number;
    // WEATHER
    temperatureCelsius?: number;
    // SATELLITE
    ndvi?: number;
    ndwi?: number;
    gndvi?: number;
    // VISION
    visualAnomalyDetected?: boolean;
    dryAreaDetected?: boolean;
    chlorosisDetected?: boolean;
    // HISTORY
    vegetationTrend?: number;
    // MAPPING
    mappingRiskDetected?: boolean;
}

export class EvidenceFusionService {
    static buildEvidence(data: EvidenceFusionInput): EvidenceItem[] {
        const evidence: EvidenceItem[] = [];
        /*
            * SENSOR
        */
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

        /*
            * WEATHER
        */

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
        /*
            * SATELLITE - NDVI
        */
        if (data.ndvi !== undefined) {
            const status = this.evaluateNdvi(data.ndvi);
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
                        : status === "WATCH"
                        ? "Vegetation vigor should be monitored."
                        : "Vegetation vigor remains healthy."
            });
        }
        /*
            * SATELLITE - NDWI
        */
        if (data.ndwi !== undefined) {
            const status = this.evaluateNdwi(data.ndwi);
            evidence.push({
                source: "SATELLITE",
                metric: "ndwi",
                value: data.ndwi,
                status,
                explanation:
                    status === "CRITICAL"
                        ? "Very low canopy water content detected."
                        : status === "WARNING"
                        ? "Reduced vegetation water availability detected."
                        : status === "WATCH"
                        ? "Water availability should be monitored."
                        : "Vegetation water content remains within expected range."
            });
        }
        /*
            * SATELLITE - GNDVI
        */
        if (data.gndvi !== undefined) {
            const status = this.evaluateGndvi(data.gndvi);
            evidence.push({
                source: "SATELLITE",
                metric: "gndvi",
                value: data.gndvi,
                status,
                explanation:
                    status === "CRITICAL"
                        ? "Severe reduction in chlorophyll activity detected."
                        : status === "WARNING"
                        ? "Vegetation greenness below expected range."
                        : status === "WATCH"
                        ? "Vegetation greenness should be monitored."
                        : "Vegetation greenness remains within expected range."
            });
    }

        /*
            * VISION - GENERAL ANOMALY
        */
        if (data.visualAnomalyDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "visualAnomaly",
                value: data.visualAnomalyDetected,
                status: data.visualAnomalyDetected
                    ? "WARNING"
                    : "NORMAL",
                explanation: data.visualAnomalyDetected
                    ? "Visual anomaly detected."
                    : "No visual anomalies detected."
            });
        }

        /*
            * VISION - DRY AREA
        */

        if (data.dryAreaDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "dryAreaDetected",
                value: data.dryAreaDetected,
                status: data.dryAreaDetected
                    ? "WARNING"
                    : "NORMAL",
                explanation: data.dryAreaDetected
                    ? "Dry area patterns detected during visual inspection."
                    : "No dry area patterns detected."
            });
        }

        /*
            * VISION - CHLOROSIS
        */

        if (data.chlorosisDetected !== undefined) {
            evidence.push({
                source: "VISION",
                metric: "chlorosisDetected",
                value: data.chlorosisDetected,
                status: data.chlorosisDetected
                    ? "WARNING"
                    : "NORMAL",
                explanation: data.chlorosisDetected
                    ? "Visual signs compatible with chlorosis were detected."
                    : "No chlorosis patterns detected."
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
                        ? "Negative vegetation trend detected."
                        : "Vegetation trend remains stable."
            });
        }
        /*
            * MAPPING
        */
        if (data.mappingRiskDetected !== undefined) {
            evidence.push({
                source: "MAPPING",
                metric: "mappingRiskDetected",
                value: data.mappingRiskDetected,
                status: data.mappingRiskDetected
                    ? "WARNING"
                    : "NORMAL",
                explanation: data.mappingRiskDetected
                    ? "Spatial analysis identified a potential risk area."
                    : "No significant mapping anomalies detected."
            });
        }
        return evidence;
    }
    private static evaluateNdvi(ndvi: number): EvidenceStatus {
        if (ndvi < 0.30) return "CRITICAL";
        if (ndvi < 0.50) return "WARNING";
        if (ndvi < 0.70) return "WATCH";
        return "NORMAL";
    }

    private static evaluateNdwi(ndwi: number): EvidenceStatus {
        if (ndwi < 0.15) return "CRITICAL";
        if (ndwi < 0.25) return "WARNING";
        if (ndwi < 0.40) return "WATCH";
        return "NORMAL";
    }
    private static evaluateGndvi(gndvi: number): EvidenceStatus {
        if (gndvi < 0.25) return "CRITICAL";
        if (gndvi < 0.40) return "WARNING";
        if (gndvi < 0.60) return "WATCH";
        return "NORMAL";
    }
}


//* Ediciones de este archivo
// @luis-hdz7 el 28/6/2026 (creación y primera edición)
// @luis-hdz7 el 29/06/2026 (realizando pequeños ajustes)
// @luis-hdz7 el 03/07/2026
