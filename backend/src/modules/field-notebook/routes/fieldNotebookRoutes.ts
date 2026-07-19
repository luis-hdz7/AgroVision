import { Router } from "express";
import { FieldNotebookController } from "../controllers/fieldNotebookController";

const router = Router();

router.get("/", FieldNotebookController.getAllFieldNotebookEntries);
router.get(
  "/zone/:zoneId",
  FieldNotebookController.getFieldNotebookEntriesByZone,
);
router.get(
  "/field/:fieldId",
  FieldNotebookController.getFieldNotebookEntriesByField,
);

export default router;
