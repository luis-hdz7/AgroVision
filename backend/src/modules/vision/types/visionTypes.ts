import { EvidenceItem } from "../../analysis/types/evidenceTypes";

export type VisionPrediction = "HEALTHTY" | "WATER_STRESS" | "CHLOROSIS" | "DRY_AREA" | "LEAF_SPOT" | "UNKNOWN";

//solicitud al servicio de vision
export interface VisionAnalyzeRequest {
    image : string;
}

//respuesta  devuelta por el servicio de vision

export interface VisionAnalyzeResponse {
    readonly prediction: string;
    readonly confidence: number;
    readonly metrics: string[];
    readonly evidence: EvidenceItem[];
    readonly explanation: string;
    readonly recommendation: string;
}