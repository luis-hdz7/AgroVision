
/**
 * =========================================
 * Vision AI Mock
 * =========================================
 * Mock de respuesta visual preliminar.
 *  Simula lo que backend debería devolver después de llamar al AI Service.
 *
 * Regla:
 * Este mock NO promete diagnóstico definitivo.
 * Solo comunica señales visuales compatibles con estrés del cultivo.
 */

import type { VisionAnalyzeRequest, VisionInspection, VisionPrediction } from "../types/visionAI.types";

// Mock principal listo para consumir desde una futura VisionAIPage.
export const visionAiMock: VisionInspection = {
    inspectionId: "inspection-001",
    fieldId: "field-001",
    zoneId: "zone-03",
    cropType: "ORANGE",

    prediction: "WATER_STRESS",
    confidence: 0.87,

    visualMetrics: {
        greenCoveragePercentage: 62,
        dryAreaPercentage: 21,
        chlorosisSuspected: false,
        leafSpotSuspected: false,
        stressPatternDetected: true,
    },

    explanation:
        "Se detecta reducción de cobertura verde y presencia moderada de áreas secas. El patrón visual es compatible con estrés hídrico preliminar.",

    recommendedAction:
        "Revisar riego en zona 03, validar humedad del suelo y repetir análisis visual en 24 horas.",

    evidence: [
        {
            source: "VISION",
            metric: "prediction",
            value: "WATER_STRESS",
            unit: null,
            status: "WARNING",
            explanation:
                "La clasificación visual preliminar detecta señales compatibles con estrés hídrico.",
        },
        {
            source: "VISION",
            metric: "greenCoveragePercentage",
            value: 62,
            unit: "%",
            status: "WATCH",
            explanation:
                "La cobertura verde se mantiene moderada, pero por debajo del rango esperado para vigor estable.",
        },
        {
            source: "VISION",
            metric: "dryAreaPercentage",
            value: 21,
            unit: "%",
            status: "WARNING",
            explanation:
                "Se identifican áreas secas moderadas en la imagen procesada.",
        },
    ],

    createdAt: "2026-06-29T08:30:00.000Z",
};

/**
 *  Genera un mock de análisis según la request.
 * osea que permite simular interacción sin backend real.
*/

export function analyzeVisionMock(request: VisionAnalyzeRequest): VisionInspection {
    return {
        ...visionAiMock,
        inspectionId: createInspectionId(),
        fieldId: request.fieldId,
        zoneId: request.zoneId ?? null,
        cropType: request.cropType,
        createdAt: new Date().toISOString(),
    };
}

/** Devuelve una etiqueta legible para la predicción.
 *  mantiene el valor técnico intacto y solo transforma la vista.
*/

export function getVisionPredictionLabel(prediction: VisionPrediction): string {
  return prediction.replaceAll("_", " ");
}

// ID simple para mocks locales., el Backend generará IDs reales después.
function createInspectionId(): string {
  return `inspection-${Date.now()}`;
}