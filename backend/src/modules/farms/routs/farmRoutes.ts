import {Router} from "express"
import { FarmController } from "../controllers/farmController";

const router = Router();
const farmController = new FarmController();
//ruta para el farmcontrollers
router.get('/overview', farmController.getFarmOverview);

export default router;

