/** Cliente real React -> Express para Vision AI. No genera clasificaciones ficticias. */

import { API_ENDPOINTS } from "../../../shared/api/endpoints";
import type {
    ApiResponse,
    VisionAnalyzeRequest,
    VisionAnalysisResult,
    VisionEvidenceItem,
    VisionInspection,
    VisionPrediction,
    VisionTopClass,
} from "../types/visionAI.types";


export const VISION_ANALYSIS_ENDPOINT = API_ENDPOINTS.visionAnalyze;
const VISION_REQUEST_TIMEOUT_MS = 30_000;


export class VisionRequestError extends Error {
    public constructor(message: string) {
        super(message);
        this.name = "VisionRequestError";
    }
}


export async function analyzeVisionImage(request: VisionAnalyzeRequest): Promise<VisionAnalysisResult> {
    let response: Response;
    try {
        response = await fetch(VISION_ANALYSIS_ENDPOINT, {
            method: "POST",
            body: buildVisionPayload(request),
            signal: AbortSignal.timeout(VISION_REQUEST_TIMEOUT_MS),
        });
    } catch (error: unknown) {
        if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
            throw new VisionRequestError("El análisis agotó el tiempo máximo. Puedes volver a intentarlo.");
        }
        throw new VisionRequestError("No fue posible conectar con Vision AI. Verifica los servicios e inténtalo de nuevo.");
    }
    if (!response.ok) {
        throw new VisionRequestError(await readApiErrorMessage(response));
    }
    let payloadJson: unknown;
    try {
        payloadJson = await response.json();
    } catch {
        throw new VisionRequestError("El backend devolvió una respuesta no válida.");
    }
    if (!isApiResponse(payloadJson) || !payloadJson.success || !payloadJson.data) {
        throw new VisionRequestError("El backend respondió sin un resultado válido de Vision AI.");
    }
    const inspection = extractVisionInspection(payloadJson.data);
    if (!inspection) {
        throw new VisionRequestError("La respuesta real no coincide con el contrato de Vision AI.");
    }
    return {
        inspection: adaptVisionInspection(inspection),
        source: "BACKEND",
        fallbackReason: null,
    };
}


function buildVisionPayload(request: VisionAnalyzeRequest): FormData {
    const formData = new FormData();
    formData.append("cropType", request.cropType);
    formData.append("fieldId", request.fieldId);
    if (request.zoneId) formData.append("zoneId", request.zoneId);
    formData.append("imageFileName", request.imageFileName);
    formData.append("image", request.imageFile);
    return formData;
}


function extractVisionInspection(payload: unknown): VisionInspection | null {
    if (isVisionInspection(payload)) return payload;
    if (isRecord(payload) && isVisionInspection(payload.inspection)) return payload.inspection;
    return null;
}


function isApiResponse(payload: unknown): payload is ApiResponse<unknown> {
    return isRecord(payload)
        && typeof payload.success === "boolean"
        && "data" in payload
        && typeof payload.message === "string"
        && (typeof payload.error === "string" || payload.error === null)
        && typeof payload.timestamp === "string";
}


function isVisionInspection(payload: unknown): payload is VisionInspection {
    if (!isRecord(payload) || !isRecord(payload.visualMetrics)) return false;
    return typeof payload.inspectionId === "string"
        && typeof payload.fieldId === "string"
        && (typeof payload.zoneId === "string" || payload.zoneId === null)
        && isCropType(payload.cropType)
        && isVisionPrediction(payload.prediction)
        && typeof payload.detectedClass === "string"
        && payload.detectedClass.length > 0
        && typeof payload.confidence === "number"
        && Number.isFinite(payload.confidence)
        && payload.confidence >= 0
        && payload.confidence <= 1
        && typeof payload.modelId === "string"
        && typeof payload.modelVersion === "string"
        && typeof payload.architecture === "string"
        && Array.isArray(payload.topClasses)
        && payload.topClasses.length >= 1
        && payload.topClasses.length <= 3
        && payload.topClasses.every(isTopClass)
        && typeof payload.inferenceMs === "number"
        && Number.isFinite(payload.inferenceMs)
        && payload.inferenceMs >= 0
        && isNullablePercentage(payload.visualMetrics.greenCoveragePercentage)
        && isNullablePercentage(payload.visualMetrics.dryAreaPercentage)
        && isNullableBoolean(payload.visualMetrics.chlorosisSuspected)
        && isNullableBoolean(payload.visualMetrics.leafSpotSuspected)
        && isNullableBoolean(payload.visualMetrics.stressPatternDetected)
        && typeof payload.explanation === "string"
        && typeof payload.recommendedAction === "string"
        && Array.isArray(payload.evidence)
        && payload.evidence.every(isVisionEvidenceItem)
        && typeof payload.createdAt === "string";
}


function isTopClass(payload: unknown): payload is VisionTopClass {
    return isRecord(payload)
        && typeof payload.className === "string"
        && typeof payload.score === "number"
        && Number.isFinite(payload.score)
        && payload.score >= 0
        && payload.score <= 1;
}


function isCropType(payload: unknown): boolean {
    return payload === "CORN" || payload === "RED_BEAN" || payload === "CASSAVA"
        || payload === "QUEQUISQUE" || payload === "ORANGE" || payload === "SORGHUM"
        || payload === "PEANUT" || payload === "GENERAL";
}


function isVisionPrediction(payload: unknown): payload is VisionPrediction {
    return payload === "HEALTHY" || payload === "VISUAL_ANOMALY" || payload === "WATER_STRESS"
        || payload === "CHLOROSIS" || payload === "DRY_AREA" || payload === "LEAF_SPOT"
        || payload === "UNKNOWN";
}


function isNullablePercentage(payload: unknown): boolean {
    return payload === null || (
        typeof payload === "number" && Number.isFinite(payload) && payload >= 0 && payload <= 100
    );
}


function isNullableBoolean(payload: unknown): boolean {
    return payload === null || typeof payload === "boolean";
}


function isVisionEvidenceItem(payload: unknown): payload is VisionEvidenceItem {
    return isRecord(payload)
        && payload.source === "VISION"
        && typeof payload.metric === "string"
        && isEvidenceStatus(payload.status)
        && isEvidenceValue(payload.value)
        && (typeof payload.unit === "string" || payload.unit === null)
        && typeof payload.explanation === "string";
}


function isEvidenceStatus(payload: unknown): boolean {
    return payload === "NORMAL" || payload === "WATCH" || payload === "WARNING" || payload === "CRITICAL";
}


function isEvidenceValue(payload: unknown): boolean {
    return payload === null || typeof payload === "string" || typeof payload === "boolean"
        || (typeof payload === "number" && Number.isFinite(payload));
}


function isRecord(payload: unknown): payload is Record<string, unknown> {
    return typeof payload === "object" && payload !== null;
}


function adaptVisionInspection(source: VisionInspection): VisionInspection {
    return {
        ...source,
        visualMetrics: { ...source.visualMetrics },
        topClasses: source.topClasses.map((item) => ({ ...item })),
        evidence: [...source.evidence],
    };
}


async function readApiErrorMessage(response: Response): Promise<string> {
    try {
        const payload: unknown = await response.json();
        if (isApiResponse(payload) && payload.error) return payload.error;
        if (isRecord(payload) && typeof payload.detail === "string") return payload.detail;
    } catch {
        // Se usa el mensaje controlado de abajo.
    }
    if (response.status === 502) return "No hay respuesta válida del backend o del AI Service. Comprueba Express (puerto 3000) y Vision AI (puerto 8000).";
    if (response.status === 503) return "El modelo seleccionado no está disponible en Vision AI.";
    if (response.status === 504) return "Vision AI tardó demasiado en responder. Intenta de nuevo con los servicios activos.";
    return `No fue posible completar el análisis. Estado HTTP: ${response.status}.`;
}
