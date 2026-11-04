/** Cliente real React -> Express para Vision AI. No genera clasificaciones ficticias. */

import { API_ENDPOINTS } from "../../../shared/api/endpoints.ts";
import { apiGet } from "../../../shared/api/apiClient.ts";
import { publishVisionAnalysisConfirmed } from "./visionAnalysisEvents.ts";
import type {
    ApiResponse,
    VisionAnalyzeRequest,
    VisionAnalysisResult,
    VisionEvidenceItem,
    VisionHistoryFilters,
    VisionHistoryItem,
    VisionHistoryPage,
    VisionInspection,
    VisionPrediction,
    VisionTopClass,
} from "../types/visionAI.types";


export const VISION_ANALYSIS_ENDPOINT = API_ENDPOINTS.visionAnalyze;
export const VISION_HISTORY_ENDPOINT = API_ENDPOINTS.visionAnalyses;
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
    const adaptedInspection = adaptVisionInspection(inspection);
    publishVisionAnalysisConfirmed({
        inspectionId: adaptedInspection.inspectionId,
        fieldId: adaptedInspection.fieldId,
        cropType: adaptedInspection.cropType,
        zoneId: adaptedInspection.zoneId ?? null,
        createdAt: adaptedInspection.createdAt,
    });
    return {
        inspection: adaptedInspection,
        source: "BACKEND",
        fallbackReason: null,
    };
}


/** Consulta una página del archivo persistido sin ejecutar inferencias. */
export async function getVisionHistory(
    filters: VisionHistoryFilters,
    signal?: AbortSignal,
): Promise<VisionHistoryPage> {
    const query = new URLSearchParams({
        fieldId: filters.fieldId,
        limit: String(filters.limit ?? 20),
    });
    if (filters.cropType !== undefined) query.set("cropType", filters.cropType);
    if (filters.zoneId === null) query.set("unassignedOnly", "true");
    else if (filters.zoneId !== undefined) query.set("zoneId", filters.zoneId);
    if (filters.cursor !== undefined) query.set("cursor", filters.cursor);

    const payload = await apiGet<unknown>(`${VISION_HISTORY_ENDPOINT}?${query}`, signal);
    if (!isVisionHistoryPage(payload)) {
        throw new VisionRequestError("El backend devolvió un historial Vision inválido.");
    }
    return {
        items: payload.items.map((item) => ({ ...item })),
        nextCursor: payload.nextCursor,
    };
}


/** Recupera el resultado histórico completo y conserva su procedencia backend. */
export async function getVisionAnalysisDetail(
    inspectionId: string,
    fieldId: string,
    signal?: AbortSignal,
): Promise<VisionAnalysisResult> {
    const endpoint = `${VISION_HISTORY_ENDPOINT}/${encodeURIComponent(inspectionId)}`
        + `?fieldId=${encodeURIComponent(fieldId)}`;
    const payload = await apiGet<unknown>(endpoint, signal);
    if (!isVisionInspection(payload, true)) {
        throw new VisionRequestError("El backend devolvió un detalle Vision inválido.");
    }
    if (payload.inspectionId !== inspectionId || payload.fieldId !== fieldId) {
        throw new VisionRequestError("El detalle Vision no corresponde al contexto solicitado.");
    }
    return {
        inspection: adaptVisionInspection(payload),
        source: "BACKEND",
        fallbackReason: null,
    };
}


/** URL validada por contexto para descargar la fotografía original archivada. */
export function getVisionAnalysisImageUrl(inspectionId: string, fieldId: string): string {
    return `${VISION_HISTORY_ENDPOINT}/${encodeURIComponent(inspectionId)}/image`
        + `?fieldId=${encodeURIComponent(fieldId)}`;
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


function isVisionInspection(
    payload: unknown,
    allowOptionalEvidenceFields = false,
): payload is VisionInspection {
    if (!isRecord(payload) || !isRecord(payload.visualMetrics)) return false;
    return isUuid(payload.inspectionId)
        && typeof payload.fieldId === "string"
        && payload.fieldId.length > 0
        && ((typeof payload.zoneId === "string" && payload.zoneId.length > 0)
            || payload.zoneId === null)
        && isCropType(payload.cropType)
        && isVisionPrediction(payload.prediction)
        && typeof payload.detectedClass === "string"
        && payload.detectedClass.length > 0
        && typeof payload.confidence === "number"
        && Number.isFinite(payload.confidence)
        && payload.confidence >= 0
        && payload.confidence <= 1
        && typeof payload.modelId === "string"
        && payload.modelId.length > 0
        && typeof payload.modelVersion === "string"
        && payload.modelVersion.length > 0
        && typeof payload.architecture === "string"
        && payload.architecture.length > 0
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
        && payload.explanation.length > 0
        && typeof payload.recommendedAction === "string"
        && payload.recommendedAction.length > 0
        && Array.isArray(payload.evidence)
        && payload.evidence.every((item) => isVisionEvidenceItem(item, allowOptionalEvidenceFields))
        && typeof payload.createdAt === "string"
        && Number.isFinite(Date.parse(payload.createdAt));
}


function isVisionHistoryPage(payload: unknown): payload is VisionHistoryPage {
    return isRecord(payload)
        && Array.isArray(payload.items)
        && payload.items.every(isVisionHistoryItem)
        && (payload.nextCursor === null
            || (typeof payload.nextCursor === "string"
                && payload.nextCursor.length > 0
                && payload.nextCursor.length <= 2048));
}


function isVisionHistoryItem(payload: unknown): payload is VisionHistoryItem {
    return isRecord(payload)
        && isUuid(payload.inspectionId)
        && typeof payload.fieldId === "string"
        && payload.fieldId.length > 0
        && ((typeof payload.zoneId === "string" && payload.zoneId.length > 0)
            || payload.zoneId === null)
        && isCropType(payload.cropType)
        && isVisionPrediction(payload.prediction)
        && typeof payload.detectedClass === "string"
        && payload.detectedClass.length > 0
        && typeof payload.confidence === "number"
        && Number.isFinite(payload.confidence)
        && payload.confidence >= 0
        && payload.confidence <= 1
        && typeof payload.modelId === "string"
        && payload.modelId.length > 0
        && typeof payload.modelVersion === "string"
        && payload.modelVersion.length > 0
        && typeof payload.hasImage === "boolean"
        && typeof payload.createdAt === "string"
        && Number.isFinite(Date.parse(payload.createdAt));
}


function isTopClass(payload: unknown): payload is VisionTopClass {
    return isRecord(payload)
        && typeof payload.className === "string"
        && payload.className.length > 0
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


function isVisionEvidenceItem(
    payload: unknown,
    allowOptionalFields = false,
): payload is VisionEvidenceItem {
    return isRecord(payload)
        && payload.source === "VISION"
        && typeof payload.metric === "string"
        && payload.metric.length > 0
        && isEvidenceStatus(payload.status)
        && ((allowOptionalFields && !("value" in payload)) || isEvidenceValue(payload.value))
        && ((allowOptionalFields && !("unit" in payload))
            || typeof payload.unit === "string" || payload.unit === null)
        && typeof payload.explanation === "string"
        && payload.explanation.length > 0;
}


function isUuid(payload: unknown): payload is string {
    return typeof payload === "string"
        && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload);
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
