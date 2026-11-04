/** =========================================
* Vision AI Types
* =========================================
*
* Tipos para análisis visual preliminar.
*
* Finalidad:
* - definir el contrato visual que consume la UI;
* - representar predicción, confianza, métricas y evidencia;
* - conservar el origen real del resultado;
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
  | "VISUAL_ANOMALY"
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


// El flujo de producción solo acepta resultados del backend.
export type VisionAnalysisSource = "BACKEND";

// Estados visuales dentro de la pagina , sirve para que la pantalla no quede en blanco.
export type VisionAnalysisStatus =
  | "IDLE"
  | "ANALYZING"
  | "RESULT"
  | "ERROR";

// métricas visuales explicables.
// todas son opcionales porque algunos análisis pueden no devolver cada métrica.
export interface VisualMetrics {
    readonly greenCoveragePercentage?: number | null;
    readonly dryAreaPercentage?: number | null;
    readonly chlorosisSuspected?: boolean | null;
    readonly leafSpotSuspected?: boolean | null;
    readonly stressPatternDetected?: boolean | null;
}

export interface VisionTopClass {
    readonly className: string;
    readonly score: number;
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
    readonly detectedClass: string;
    readonly confidence: number;
    readonly modelId: string;
    readonly modelVersion: string;
    readonly architecture: string;
    readonly topClasses: ReadonlyArray<VisionTopClass>;
    readonly inferenceMs: number;
    readonly visualMetrics: VisualMetrics;

    readonly explanation: string;
    readonly recommendedAction: string;

    readonly evidence: ReadonlyArray<VisionEvidenceItem>;
    readonly createdAt: string;
}


/**
* Request usada por el frontend para pedir análisis.
*
* imageFile:
* Archivo requerido por el contrato multipart.
*
* imageFileName:
* Nombre de la fotografía enviada con el archivo multipart.
*/
export interface VisionAnalyzeRequest {
    readonly cropType: CropType;
    readonly fieldId: string;
    readonly zoneId?: string | null;
    readonly imageFileName: string;
    readonly imageFile: File;
}


//Resultado final que recibe la pagina.
// La procedencia se conserva fuera del contrato de inspección.
export interface VisionAnalysisResult {
    readonly inspection: VisionInspection;
    readonly source: VisionAnalysisSource;
    readonly fallbackReason?: string | null;
}


/** Resumen persistido utilizado por la tabla de historial. */
export interface VisionHistoryItem {
    readonly inspectionId: string;
    readonly fieldId: string;
    readonly zoneId: string | null;
    readonly cropType: CropType;
    readonly prediction: VisionPrediction;
    readonly detectedClass: string;
    readonly confidence: number;
    readonly modelId: string;
    readonly modelVersion: string;
    readonly hasImage: boolean;
    readonly createdAt: string;
}

export interface VisionHistoryPage {
    readonly items: ReadonlyArray<VisionHistoryItem>;
    readonly nextCursor: string | null;
}

export interface VisionHistoryFilters {
    readonly fieldId: string;
    readonly cropType?: CropType;
    readonly zoneId?: string | null;
    readonly limit?: number;
    readonly cursor?: string;
}

export type VisionHistoryStatus =
  | "INACTIVE"
  | "LOADING"
  | "READY"
  | "EMPTY"
  | "ERROR";


export interface ApiResponse<T> {
    readonly success: boolean;
    readonly data: T | null;
    readonly message: string;
    readonly error: string | null;
    readonly timestamp: string;
}
