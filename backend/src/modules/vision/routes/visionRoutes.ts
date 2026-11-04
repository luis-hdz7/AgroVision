import { Router } from "express";
import { VisionController } from "../controllers/visionController";
import { VisionHistoryController } from "../controllers/visionHistoryController";
import { parseVisionUpload } from "../middleware/visionUpload";

const router = Router();
/** GET /api/vision/analyses: historial persistido, filtrado y paginado. */
router.get("/analyses", VisionHistoryController.list);

/** GET /api/vision/analyses/:inspectionId/image: fotografía original archivada. */
router.get("/analyses/:inspectionId/image", VisionHistoryController.image);

/** GET /api/vision/analyses/:inspectionId: resultado persistido completo. */
router.get("/analyses/:inspectionId", VisionHistoryController.detail);

/**
 * POST /api/vision/analyze
 * Recibe una solicitud de análisis visual y devuelve
 * una predicción compatible con el AI Service.
 */
router.post(
  "/analyze",
  parseVisionUpload,
  VisionController.analyzeImage,
);

export default router;
