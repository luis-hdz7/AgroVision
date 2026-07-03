import { Router } from "express";
import { getPrescriptiveReport } from "../controllers/reportController";

const router = Router();

router.get("/prescriptive/:zoneId", getPrescriptiveReport);

export default router;
