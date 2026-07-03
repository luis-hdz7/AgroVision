import { Router, Request, Response } from "express";
import { VegetationService } from "../types/services/vegetationService";
import { ZoneInsightService } from "../types/services/zoneInsightService";
import { getVegetationIndices } from "../controllers/vegetationController";
import { ok } from "../../../shared/responses/apiResponses";

const router = Router();

// Endpoints de Índices de Vegetación (Satelital)
router.get("/snapshots", (req: Request, res: Response) => {
    const data = VegetationService.getAllSnapshots();
    res.status(200).json(ok(data, "Snapshots de vegetación recuperados exitosamente"));
});

router.get("/snapshots/field/:fieldId", (req: Request, res: Response) => {
    const fieldId = req.params.fieldId as string;
    const data = VegetationService.getHistoryByField(fieldId);
    res.status(200).json(ok(data, `Historial de vegetación para la parcela ${req.params.fieldId} recuperado`));
});

// Endpoints de ZoneInsight (Análisis de Riesgo Multifuente)
router.get("/insights", (req: Request, res: Response) => {
    const data = ZoneInsightService.getAllInsights();
    res.status(200).json(ok(data, "Insights de rendimiento por zona recuperados exitosamente"));
});

router.get("/insights/zone/:zoneId", (req: Request, res: Response) => {
    const zoneId = req.params.zoneId as string;
    const data = ZoneInsightService.getInsightByZone(zoneId);
    res.status(200).json(ok(data, `Análisis de la zona ${req.params.zoneId} obtenido`));
});

router.get("/indices", getVegetationIndices);

export default router;