import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController";

const router = Router();

router.get("/summary", getDashboardSummary);

export default router;