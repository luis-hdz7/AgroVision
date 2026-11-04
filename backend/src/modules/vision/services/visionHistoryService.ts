/**
 * Lee VisionAnalysisRecord mediante Prisma compartido, con filtros y cursor estables.
 * Devuelve únicamente contratos persistidos válidos; nunca infiere ni escribe datos.
 */

import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../../shared/database/prisma";
import {
  visionAnalyzeResponseRecordSchema,
  visionHistoryCursorSchema,
} from "../schemas/visionHistorySchemas";
import type {
  VisionHistoryDetail,
  VisionHistoryDetailRequest,
  VisionHistoryFilters,
  VisionHistoryImage,
  VisionHistoryItem,
  VisionHistoryPage,
} from "../types/visionHistoryTypes";
import type { VisionAnalyzeResponse } from "../types/visionTypes";

type VisionHistoryErrorCode = "BAD_CURSOR" | "NOT_FOUND" | "INVALID_RECORD";

export class VisionHistoryError extends Error {
  public readonly code: VisionHistoryErrorCode;
  public readonly recordId?: string;

  public constructor(code: VisionHistoryErrorCode, message: string, recordId?: string) {
    super(message);
    this.name = "VisionHistoryError";
    this.code = code;
    this.recordId = recordId;
  }
}

interface RecordProjection {
  readonly inspectionId: string;
  readonly fieldId: string;
  readonly zoneId: string | null;
  readonly cropType: string;
  readonly result: unknown;
  readonly createdAt: Date;
  readonly image?: { readonly inspectionId: string } | null;
}

const recordSelect = {
  inspectionId: true,
  fieldId: true,
  zoneId: true,
  cropType: true,
  result: true,
  createdAt: true,
  // Solo se consulta la identidad de la relación; el listado nunca carga el binario.
  image: { select: { inspectionId: true } },
} as const;

export class VisionHistoryService {
  public static async list(filters: VisionHistoryFilters): Promise<VisionHistoryPage> {
    const cursor = filters.cursor ? decodeCursor(filters.cursor, filters) : null;
    const where = buildWhere(filters, cursor);
    const rows = await prisma.visionAnalysisRecord.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { inspectionId: "desc" }],
      take: filters.limit + 1,
      select: recordSelect,
    });
    const hasNextPage = rows.length > filters.limit;
    const pageRows = rows.slice(0, filters.limit);
    const items = pageRows.map((row) => toHistoryItem(validateRecord(row), row.image != null));
    const lastRow = pageRows.at(-1);

    return {
      items,
      nextCursor: hasNextPage && lastRow ? encodeCursor(lastRow, filters) : null,
    };
  }

  public static async detail(request: VisionHistoryDetailRequest): Promise<VisionHistoryDetail> {
    const row = await prisma.visionAnalysisRecord.findFirst({
      where: { inspectionId: request.inspectionId, fieldId: request.fieldId },
      select: recordSelect,
    });

    if (!row) {
      throw new VisionHistoryError("NOT_FOUND", "El análisis solicitado no existe.");
    }

    return validateRecord(row);
  }

  public static async image(request: VisionHistoryDetailRequest): Promise<VisionHistoryImage> {
    const row = await prisma.visionAnalysisRecord.findFirst({
      where: { inspectionId: request.inspectionId, fieldId: request.fieldId },
      select: {
        inspectionId: true,
        image: {
          select: { content: true, mimeType: true, sizeBytes: true },
        },
      },
    });

    if (!row?.image) {
      throw new VisionHistoryError("NOT_FOUND", "La imagen solicitada no está archivada.");
    }

    const content = new Uint8Array(row.image.content);
    if (!isSupportedImageMime(row.image.mimeType) || row.image.sizeBytes !== content.byteLength) {
      throw invalidRecord(row.inspectionId, "metadatos binarios incoherentes");
    }

    return { content, mimeType: row.image.mimeType, sizeBytes: row.image.sizeBytes };
  }
}

function buildWhere(
  filters: VisionHistoryFilters,
  cursor: { readonly createdAt: string; readonly inspectionId: string } | null,
): Prisma.VisionAnalysisRecordWhereInput {
  const base: Prisma.VisionAnalysisRecordWhereInput = { fieldId: filters.fieldId };
  if (filters.cropType) base.cropType = filters.cropType;
  if (filters.zoneId !== undefined) base.zoneId = filters.zoneId;
  if (filters.unassignedOnly) base.zoneId = null;

  if (!cursor) return base;
  const cursorDate = new Date(cursor.createdAt);
  return {
    AND: [
      base,
      {
        OR: [
          { createdAt: { lt: cursorDate } },
          { createdAt: cursorDate, inspectionId: { lt: cursor.inspectionId } },
        ],
      },
    ],
  };
}

function validateRecord(row: RecordProjection): VisionAnalyzeResponse {
  const parsed = visionAnalyzeResponseRecordSchema.safeParse(row.result);
  if (!parsed.success) {
    throw invalidRecord(row.inspectionId, "JSON persistido fuera de contrato");
  }

  const result = parsed.data;
  const sameInstant = Date.parse(result.createdAt) === row.createdAt.getTime();
  if (
    result.inspectionId !== row.inspectionId ||
    result.fieldId !== row.fieldId ||
    result.zoneId !== row.zoneId ||
    result.cropType !== row.cropType ||
    !sameInstant
  ) {
    throw invalidRecord(row.inspectionId, "columnas y resultado incoherentes");
  }

  return result;
}

function invalidRecord(recordId: string, reason: string): VisionHistoryError {
  console.error(`[AgroVision] Registro Vision inválido ${recordId}: ${reason}.`);
  return new VisionHistoryError(
    "INVALID_RECORD",
    "El análisis histórico almacenado no tiene un contrato válido.",
    recordId,
  );
}

function toHistoryItem(result: VisionAnalyzeResponse, hasImage: boolean): VisionHistoryItem {
  return {
    inspectionId: result.inspectionId,
    fieldId: result.fieldId,
    zoneId: result.zoneId,
    cropType: result.cropType,
    prediction: result.prediction,
    detectedClass: result.detectedClass,
    confidence: result.confidence,
    modelId: result.modelId,
    modelVersion: result.modelVersion,
    createdAt: result.createdAt,
    hasImage,
  };
}

function isSupportedImageMime(
  mimeType: string,
): mimeType is "image/jpeg" | "image/png" | "image/webp" {
  return mimeType === "image/jpeg" || mimeType === "image/png" || mimeType === "image/webp";
}

function encodeCursor(row: RecordProjection, filters: VisionHistoryFilters): string {
  const payload = {
    version: 1 as const,
    createdAt: row.createdAt.toISOString(),
    inspectionId: row.inspectionId,
    filters: cursorFilters(filters),
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodeCursor(cursor: string, filters: VisionHistoryFilters) {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(cursor)) throw new Error("encoding");
    const bytes = Buffer.from(cursor, "base64url");
    if (bytes.toString("base64url") !== cursor) throw new Error("encoding");
    const parsed = visionHistoryCursorSchema.parse(JSON.parse(bytes.toString("utf8")));
    if (JSON.stringify(parsed.filters) !== JSON.stringify(cursorFilters(filters))) {
      throw new Error("filters");
    }
    return parsed;
  } catch {
    throw new VisionHistoryError("BAD_CURSOR", "El cursor no es válido para estos filtros.");
  }
}

function cursorFilters(filters: VisionHistoryFilters) {
  return {
    fieldId: filters.fieldId,
    cropType: filters.cropType ?? null,
    zoneId: filters.zoneId ?? null,
    unassignedOnly: filters.unassignedOnly,
  };
}

/** Integración: el controller traduce errores seguros y expone list/detail sin efectos laterales. */
