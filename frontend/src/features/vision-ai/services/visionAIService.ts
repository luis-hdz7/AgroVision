/** 
 * =========================================
 * Vision AI Services
 * ========================================= 
 * 
 * Servicio Frt para el análisis visual 
 * 
 * Finalidad:
 * - ocultar a visionAiPage si el resultado iene ya sea de bakcend o del mock local
 * - preparar POST /api/vision/analyze;
 * - mantener la UI desacoplada del mock.
 *
*/


import { API_ENDPOINTS } from "../../../shared/api/endpoints";
import type { VisionInspection, VisionAnalyzeRequest } from "../types/visionAi.types";
import { analyzeVisionMock } from "./visionAIMock";


// endpoint oficial que backend deberá entregar
export const VISION_ANALYSIS_ENDPOINT = API_ENDPOINTS.visionAnalyze;

/**
 * Aqui se ejecuta el análisis visual.
 * 
 * En esta fase del proyecto usa mock local
 * luego se reemplaza internamente por FormData + fetch 
*/

export async function analyzeVisionImage(request: VisionAnalyzeRequest): Promise<VisionInspection> {
    const result = analyzeVisionMock(request);
    return adaptVisionInspection(result);
}

// 
function  adaptVisionInspection(source: VisionInspection): VisionInspection {
    return {
        ...source,
        visualMetrics: {
            ...source.visualMetrics,
        },
        evidence: [...source.evidence],
    };
}

