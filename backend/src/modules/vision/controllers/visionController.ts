import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { VisionService } from "../services/visionService";

export class VisionController {
    public static analyzeImage(req: Request, res: Response): void {
        try {
            //informacion enviada por el cliente
            const request = req.body;
            //analisis al servicio
            const result = VisionService.analyzeImage(request);

//      respuesta en contraro ApiResponse

            res.status(200).json(ok(result, "Visual completed successfully"));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message: "Failed to analyze image";

            res.status(500).json(fail(message))
        }
    }
}