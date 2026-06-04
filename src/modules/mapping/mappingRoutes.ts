
import { Router } from "express";
import { getMappingSimulation } from "./mappingController";
import { getMappingPlayback } from "./playbackController";
import { getMappingSummary } from "./summaryController";



/**
  * Rutas de la API de mapeo.

  * Se monta en server.ts como:
  * app.use("/api/mapping", mappingRoutes)
*/

const mappingRouter = Router();

mappingRouter.get(
  "/simulation",
  getMappingSimulation
);

mappingRouter.get(
  "/playback",
  getMappingPlayback
);

mappingRouter.get(
  "/summary",
  getMappingSummary
);

export default mappingRouter;

