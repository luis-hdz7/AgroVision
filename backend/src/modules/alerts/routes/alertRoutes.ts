import { Router } from "express";
import { AlertController } from "../controllers/alertController";

const router = Router();

router.get(
    "/",
    AlertController.getAllerts
);

export default router;