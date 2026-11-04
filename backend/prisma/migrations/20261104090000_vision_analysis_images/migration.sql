-- Archivo opcional de la fotografía original; no exige completar registros históricos.
CREATE TABLE "vision_analysis_images" (
    "inspectionId" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vision_analysis_images_pkey" PRIMARY KEY ("inspectionId")
);

ALTER TABLE "vision_analysis_images"
ADD CONSTRAINT "vision_analysis_images_inspectionId_fkey"
FOREIGN KEY ("inspectionId") REFERENCES "vision_analysis_records"("inspectionId")
ON DELETE CASCADE ON UPDATE CASCADE;
