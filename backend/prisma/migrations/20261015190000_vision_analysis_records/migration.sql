-- Tabla independiente: conserva el resultado completo sin modificar las inspecciones existentes.
CREATE TABLE "vision_analysis_records" (
    "inspectionId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "zoneId" TEXT,
    "cropType" TEXT NOT NULL,
    "imageFileName" TEXT NOT NULL,
    "imageSha256" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "vision_analysis_records_pkey" PRIMARY KEY ("inspectionId")
);

CREATE INDEX "vision_analysis_records_createdAt_idx" ON "vision_analysis_records"("createdAt");
CREATE INDEX "vision_analysis_records_cropType_createdAt_idx" ON "vision_analysis_records"("cropType", "createdAt");
