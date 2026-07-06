import { Router } from "express";
import { getZoneAnalysis } from "../controllers/zoneAnalysisController";

export const zoneAnalysisRouter = Router()

zoneAnalysisRouter.get('/zone/:zoneId', getZoneAnalysis)