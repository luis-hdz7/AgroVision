import { Router } from "express";
import { getMappingSimulation } from "./mappingController";
import { getMappingPlayback } from "./playbackController";

const mappingRouter = Router();

mappingRouter.get(
  "/simulation",
  getMappingSimulation
);

mappingRouter.get(
  "/playback",
  getMappingPlayback
);

export default mappingRouter;