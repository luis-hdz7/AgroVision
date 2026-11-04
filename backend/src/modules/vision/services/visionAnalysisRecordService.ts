/** Guarda atómicamente la inferencia y la fotografía original que la produjo. */

import { createHash } from "node:crypto";
import { basename } from "node:path";

import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../../shared/database/prisma";
import type { VisionAnalyzeRequest, VisionAnalyzeResponse } from "../types/visionTypes";

export async function recordVisionAnalysis(
  request: VisionAnalyzeRequest,
  result: VisionAnalyzeResponse,
): Promise<void> {
  const imageSha256 = createHash("sha256").update(request.image.buffer).digest("hex");
  const imageFileName = basename(request.image.fileName);
  validateVisionImageSignature(request.image.buffer, request.image.mimeType);

  // La escritura anidada confirma el análisis y su imagen en una sola transacción.
  await prisma.visionAnalysisRecord.create({
    data: {
      inspectionId: result.inspectionId,
      fieldId: result.fieldId,
      zoneId: result.zoneId,
      cropType: result.cropType,
      imageFileName,
      imageSha256,
      result: JSON.parse(JSON.stringify(result)) as Prisma.InputJsonValue,
      createdAt: new Date(result.createdAt),
      image: {
        create: {
          content: new Uint8Array(request.image.buffer),
          mimeType: request.image.mimeType,
          sizeBytes: request.image.buffer.byteLength,
        },
      },
    },
  });
}

export function validateVisionImageSignature(buffer: Buffer, mimeType: string): void {
  const isJpeg = mimeType === "image/jpeg"
    && buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;
  const isPng = mimeType === "image/png"
    && buffer.length >= 8
    && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = mimeType === "image/webp"
    && buffer.length >= 12
    && buffer.toString("ascii", 0, 4) === "RIFF"
    && buffer.toString("ascii", 8, 12) === "WEBP";

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error("VISION_IMAGE_SIGNATURE_MISMATCH");
  }
}
