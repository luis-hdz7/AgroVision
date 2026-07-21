import { Router } from "express";
import { getAllSnapshots,getVegetationHistory,getVegetationIndices } from "../controllers/vegetationController";
//import { ZoneInsightService } from "../types/services/zoneInsightService";
//import { ok } from "../../../shared/responses/apiResponses";

const router = Router();

// Endpoints de Índices de Vegetación (Satelital)
router.get("/snapshots", getAllSnapshots);

router.get("/snapshots/field/:fieldId", getVegetationHistory);

// Endpoints de ZoneInsight (Análisis de Riesgo Multifuente)
// router.get("/insights", (req: Request, res: Response) => {
//     const data = ZoneInsightService.getAllInsights();
//     res.status(200).json(ok(data, "Insights de rendimiento por zona recuperados exitosamente"));
// });

// router.get("/insights/zone/:zoneId", (req: Request, res: Response) => {
//     const zoneId = req.params.zoneId as string;
//     const data = ZoneInsightService.getInsightByZone(zoneId);
//     res.status(200).json(ok(data, `Análisis de la zona ${req.params.zoneId} obtenido`));
// });

router.get("/indices", getVegetationIndices);

export default router;