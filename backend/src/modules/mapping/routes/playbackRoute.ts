import { Router } from "express";

import {
  getMappingPlayback,
} from "../controllers/playbackController";

const router = Router();

router.get(
  "/playback",
  getMappingPlayback
);

export default router;