import { Router } from "express";
import { getRecommendations } from "../controllers/recommendationController";

const router = Router();

router.get("/", getRecommendations);

export default router;


/*
    * Ediciones de este archivo
    @luis-hdz7 el 01/7/2026 (creación y primera edición)
*/