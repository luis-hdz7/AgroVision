import { Request, Response } from "express";
import { recommendationsMock } from "../data/recommendationsMock";
export function getRecommendations(req: Request,res: Response): void {
    res.status(200).json({
        success: true,
        count: recommendationsMock.length,
        data: recommendationsMock
    });
}

/*
    * Ediciones de este archivo
    @luis-hdz7 el 01/7/2026 (creación y primera edición)
*/