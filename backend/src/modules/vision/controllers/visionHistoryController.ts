/**
 * Controlador HTTP de historial y detalle Vision.
 * Valida entradas, evita caché y traduce fallos sin exponer datos internos.
 */

import type { Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";
import { fail, ok } from "../../../shared/responses/apiResponses";
import {
  visionHistoryDetailParamsSchema,
  visionHistoryDetailQuerySchema,
  visionHistoryQuerySchema,
} from "../schemas/visionHistorySchemas";
import { VisionHistoryError, VisionHistoryService } from "../services/visionHistoryService";

export class VisionHistoryController {
  public static async list(req: Request, res: Response): Promise<void> {
    res.set("Cache-Control", "no-store");
    const parsed = visionHistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json(fail("Los filtros del historial Vision no son válidos."));
      return;
    }

    try {
      const page = await VisionHistoryService.list(parsed.data);
      res.status(200).json(ok(page, "Historial Vision cargado correctamente."));
    } catch (error: unknown) {
      respondWithHistoryError(error, res);
    }
  }

  public static async detail(req: Request, res: Response): Promise<void> {
    res.set("Cache-Control", "no-store");
    const params = visionHistoryDetailParamsSchema.safeParse(req.params);
    const query = visionHistoryDetailQuerySchema.safeParse(req.query);
    if (!params.success || !query.success) {
      res.status(400).json(fail("La solicitud de detalle Vision no es válida."));
      return;
    }

    try {
      const result = await VisionHistoryService.detail({
        inspectionId: params.data.inspectionId,
        fieldId: query.data.fieldId,
      });
      res.status(200).json(ok(result, "Análisis Vision cargado correctamente."));
    } catch (error: unknown) {
      respondWithHistoryError(error, res);
    }
  }

  public static async image(req: Request, res: Response): Promise<void> {
    res.set("Cache-Control", "private, no-store");
    res.set("X-Content-Type-Options", "nosniff");
    const params = visionHistoryDetailParamsSchema.safeParse(req.params);
    const query = visionHistoryDetailQuerySchema.safeParse(req.query);
    if (!params.success || !query.success) {
      res.status(400).json(fail("La solicitud de imagen Vision no es válida."));
      return;
    }

    try {
      const image = await VisionHistoryService.image({
        inspectionId: params.data.inspectionId,
        fieldId: query.data.fieldId,
      });
      res.status(200).set({
        "Content-Type": image.mimeType,
        "Content-Length": String(image.sizeBytes),
        "X-Content-Type-Options": "nosniff",
      }).send(Buffer.from(image.content));
    } catch (error: unknown) {
      respondWithHistoryError(error, res);
    }
  }
}

function respondWithHistoryError(error: unknown, res: Response): void {
  if (error instanceof VisionHistoryError) {
    if (error.code === "BAD_CURSOR") {
      res.status(400).json(fail(error.message));
      return;
    }
    if (error.code === "NOT_FOUND") {
      res.status(404).json(fail(error.message));
      return;
    }
    res.status(500).json(fail("No fue posible leer el análisis histórico almacenado."));
    return;
  }

  if (isDatabaseUnavailable(error)) {
    res.status(503).json(fail("La base de datos no está disponible. Inténtalo más tarde."));
    return;
  }

  res.status(500).json(fail("No fue posible consultar el historial Vision."));
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  return error instanceof Prisma.PrismaClientKnownRequestError
    && ["P1001", "P1002", "P1008", "P1017"].includes(error.code);
}

/** El router registra ambos handlers bajo /api/vision/analyses. */
