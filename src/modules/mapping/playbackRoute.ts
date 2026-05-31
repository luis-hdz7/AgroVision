import { Router } from "express";

import {
  getMappingPlayback,
} from "./playbackController";

const router = Router();

router.get(
  "/playback",
  getMappingPlayback
);

export default router;