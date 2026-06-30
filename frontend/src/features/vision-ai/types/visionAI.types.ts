/** =========================================
* Vision AI Types
* =========================================
*
* Tipos para análisis visual preliminar.
* El objetivo no es diagnosticar enfermedades, sino detectar señales visuales compatibles con estrés, deterioro o anomalía agrícola.
*
* Regla:
* - AI Service analiza imagen.
* - Backend normaliza y decide riesgo.
* - Frontend visualiza resultado y explicación.
*/

import type { CropType } from "../../crops/types/cropProfile.types";

// predicciones visuales permitidas.
export type VisionPrediction =
  | "HEALTHY"
  | "WATER_STRESS"
  | "CHLOROSIS"
  | "DRY_AREA"
  | "LEAF_SPOT"
  | "UNKNOWN";

// estado técnico de evidencia visual.
export type VisionEvidenceStatus =
  | "NORMAL"
  | "WATCH"
  | "WARNING"
  | "CRITICAL";

// métricas visuales explicables.
// todas son opcionales porque algunos análisis pueden no devolver cada métrica.
export interface VisualMetrics {
    readonly greenCoveragePercentage?: number | null;
    readonly dryAreaPercentage?: number | null;
    readonly chlorosisSuspected?: boolean;
    readonly leafSpotSuspected?: boolean;
    readonly stressPatternDetected?: boolean;
}

// evidencia específica generada desde Vision AI.
export interface VisionEvidenceItem {
    readonly source: "VISION";
    readonly metric: string;
    readonly value?: number | string | boolean | null;
    readonly unit?: string | null;
    readonly status: VisionEvidenceStatus;
    readonly explanation: string;
}

// Resultado normalizado de análisis visual.
// esto se alinea con VisionInspection del contrato.
export interface VisionInspection {
    readonly inspectionId: string;
    readonly fieldId: string;
    readonly zoneId?: string | null;
    readonly cropType: CropType;

    readonly prediction: VisionPrediction;
    readonly confidence: number;

    readonly visualMetrics: VisualMetrics;

    readonly explanation: string;
    readonly recommendedAction: string;

    readonly evidence: ReadonlyArray<VisionEvidenceItem>;

    readonly createdAt: string;
}

// Payload conceptual para una futura request.
// El archivo real se mandará como FormData cuando backend esté listo.
export interface VisionAnalyzeRequest {
    readonly cropType: CropType;
    readonly fieldId: string;
    readonly zoneId?: string | null;
    readonly imageFileName: string;
}