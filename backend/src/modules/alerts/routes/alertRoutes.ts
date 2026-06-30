import { Router } from "express";
import { AlertController } from "../controllers/alertController";

const router = Router();

router.get(
    "/",
    AlertController.getAlerts
);

export default router;