/**
 * Contratos de lectura del historial Vision persistido.
 * Reciben filtros HTTP validados y devuelven resúmenes o el resultado original.
 */

import type { VisionAnalyzeResponse, VisionCropType, VisionPrediction } from "./visionTypes";

export interface VisionHistoryFilters {
  readonly fieldId: string;
  readonly cropType?: VisionCropType;
  readonly zoneId?: string;
  readonly unassignedOnly: boolean;
  readonly limit: number;
  readonly cursor?: string;
}

export interface VisionHistoryItem {
  readonly inspectionId: string;
  readonly fieldId: string;
  readonly zoneId: string | null;
  readonly cropType: VisionCropType;
  readonly prediction: VisionPrediction;
  readonly detectedClass: string;
  readonly confidence: number;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly createdAt: string;
  readonly hasImage: boolean;
}

export interface VisionHistoryPage {
  readonly items: ReadonlyArray<VisionHistoryItem>;
  readonly nextCursor: string | null;
}

export interface VisionHistoryDetailRequest {
  readonly inspectionId: string;
  readonly fieldId: string;
}

export type VisionHistoryDetail = VisionAnalyzeResponse;

export interface VisionHistoryImage {
  readonly content: Uint8Array;
  readonly mimeType: "image/jpeg" | "image/png" | "image/webp";
  readonly sizeBytes: number;
}

/** El consumidor integra estos contratos a través de los dos GET del router Vision. */
