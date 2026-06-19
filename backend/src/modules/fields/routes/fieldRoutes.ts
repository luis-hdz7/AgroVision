import { Router } from "express";
import { FieldController } from "../controllers/fieldController";

const router = Router();
const fiedlController = new FieldController();

router.get("/", fiedlController.getFields);

export default router;
