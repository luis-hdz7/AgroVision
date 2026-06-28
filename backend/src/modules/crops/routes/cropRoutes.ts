import { Router } from "express";
import { CropProfileController } from "../controllers/cropProfileControllers";

const router = Router();
const controller = new CropProfileController();

router.get("/profiles", controller.getAllProfiles);

export default router;