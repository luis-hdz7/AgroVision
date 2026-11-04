/** Controller HTTP del análisis visual multipart. */

import type { Request, Response } from "express";

import { fail, ok } from "../../../shared/responses/apiResponses";
import { visionAnalyzeFieldsSchema } from "../schemas/visionSchemas";
import {
  recordVisionAnalysis,
  validateVisionImageSignature,
} from "../services/visionAnalysisRecordService";
import { VisionService, VisionServiceError } from "../services/visionService";

export class VisionController {
  public static async analyzeImage(req: Request, res: Response): Promise<void> {
    const fields = visionAnalyzeFieldsSchema.safeParse(req.body);

    if (!fields.success) {
      res.status(400).json(
        fail("Los metadatos del análisis visual son inválidos."),
      );
      return;
    }

    if (!req.file || req.file.size === 0) {
      res.status(400).json(
        fail("Debes adjuntar una imagen en el campo multipart 'image'."),
      );
      return;
    }

    try {
      validateVisionImageSignature(req.file.buffer, req.file.mimetype);
    } catch {
      res.status(415).json(
        fail("El contenido del archivo no coincide con un JPEG, PNG o WebP válido."),
      );
      return;
    }

    try {
      const request = {
        cropType: fields.data.cropType,
        fieldId: fields.data.fieldId,
        zoneId: fields.data.zoneId ?? null,
        image: {
          buffer: req.file.buffer,
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size,
        },
      };
      const result = await VisionService.analyzeImage(request);

      try {
        await recordVisionAnalysis(request, result);
      } catch (error: unknown) {
        console.error("[AgroVision] No se pudo registrar el análisis Vision AI:",
          error instanceof Error ? error.name : "Error desconocido");
        res.status(503).json(fail("El análisis terminó, pero no pudo registrarse en la base de datos. Inténtalo de nuevo."));
        return;
      }

      res.status(200).json(
        ok(result, "Visual analysis completed successfully"),
      );
    } catch (error: unknown) {
      if (error instanceof VisionServiceError) {
        res.status(error.statusCode).json(fail(error.message));
        return;
      }

      res.status(500).json(
        fail("No fue posible completar el análisis visual."),
      );
    }
  }
}
