import { Request, Response } from "express";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { RecommendationService } from "../services/recommendationService";

// import { recommendationsMock } from "../data/recommendationsMock";

export function getRecommendations(req: Request,res: Response): void {
    //*aqui leo, modifique esto para que cumpla con el contrato apiResponse
    // res.status(200).json({
    //     success: true,
    //     count: recommendationsMock.length,
    //     data: recommendationsMock
    // });
    try {
        const recommendations = RecommendationService.getAllRecommendations();

        res.status(200).json(ok(recommendations, "Recommendations loaded successfully"));
    } catch (error: any) {
        res.status(500).json(fail(error.message || "Failed to load recommendations"));
    }
}

/*
    * Ediciones de este archivo
    @luis-hdz7 el 01/7/2026 (creación y primera edición)
    Leo Teleria 08-07-26
*/