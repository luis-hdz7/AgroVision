import {Request, Response} from "express";
import { FarmService } from "../service/farmService";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { FarmOverview } from "../types/farmTypes";

export class FarmController {
    private farmService = new FarmService();
//funcion asincrona para guardar los datos si cumplen con el tipo
    public getFarmOverview = async (req: Request, res: Response): Promise<void> => {
        try {
            const overview:FarmOverview = await this.farmService.getFarmOverview();
            res.status(200).json(ok(overview, "Farm overview loaded successfully"));
            
        } catch (error) {
            res.status(500).json(fail("Failed to load farm overview"));
        }
    };
}