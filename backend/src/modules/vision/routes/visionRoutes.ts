import { Router } from "express";
import { VisionController } from "../controllers/visionController";

const router = Router();
/**
 * POST /api/vision/analyze
 * Recibe una solicitud de análisis visual y devuelve
 * una predicción compatible con el AI Service.
 */
router.post("/analyze", VisionController.analyzeImage);

export default router;