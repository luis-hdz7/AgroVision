import { Router } from "express";
import { CropProfileController } from "../controllers/cropProfileControllers";

const router = Router();
const controller = new CropProfileController();
// Trae todos los perfiles al consultar /api/crops
router.get("/", controller.getAllProfiles);
// Trae un perfil específico al consultar /api/crops/RED_BEAN
router.get("/:type", controller.getProfileByType);

export default router;