import { VisionAnalyzeRequest, VisionAnalyzeResponse } from "../types/visionTypes";

//Servicio para procesar solicitud de analisis visual
//ahorita solo devuelve una respuesta simulada compatiblecon el ai serivce

export class VisionService {
    public static analyzeImage(request: VisionAnalyzeRequest,): VisionAnalyzeResponse {
        return {
            prediction: "WATER_STRESS",
            confidence: 0.83,
            metrics: ["visual_pattern"],
            evidence: [
                {
                    source: "VISION",
                    metric: "visual_pattern",
                    value: "WATER_STRESS",
                    status: "WARNING",
                    explanation: "Visual indicators suggest possible water stress."
                }
            ],
            explanation: "Visual indicators suggest possible water stress.",
            recommendation: "Increase irrigation and monitor vegetation health."
        }
    }
}