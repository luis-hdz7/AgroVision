/** Guarda la inferencia real y su procedencia sin almacenar los píxeles de la imagen. */

import { createHash } from "node:crypto";
import { basename } from "node:path";

import prisma from "../../../shared/database/prisma";
import type { VisionAnalyzeRequest, VisionAnalyzeResponse } from "../types/visionTypes";

export async function recordVisionAnalysis(
  request: VisionAnalyzeRequest,
  result: VisionAnalyzeResponse,
): Promise<void> {
  const imageSha256 = createHash("sha256").update(request.image.buffer).digest("hex");
  const imageFileName = basename(request.image.fileName);

  await prisma.$executeRaw`
    INSERT INTO "vision_analysis_records" (
      "inspectionId", "fieldId", "zoneId", "cropType", "imageFileName",
      "imageSha256", "result", "createdAt"
    ) VALUES (
      ${result.inspectionId}, ${result.fieldId}, ${result.zoneId}, ${result.cropType},
      ${imageFileName}, ${imageSha256}, CAST(${JSON.stringify(result)} AS jsonb),
      ${new Date(result.createdAt)}
    )
  `;
}
