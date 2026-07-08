import { Router } from "express";
import { getRiskByField } from "../controllers/riskController";

export const riskRouter = Router()

/**
 * Endpoint oficial para obtener el resumen de riesgo de una parcela.
 *
 * GET /api/risk/field/:fieldId
 */

riskRouter.get("/field/:fieldId", getRiskByField);

export default riskRouter;