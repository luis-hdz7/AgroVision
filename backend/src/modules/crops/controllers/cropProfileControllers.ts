import { Request, Response } from "express";
import { CropProfileService } from "../services/cropProfileService";
import { ok, fail } from "../../../shared/responses/apiResponses";


export class CropProfileController {
    /**
   * Controlador para obtener todos los perfiles de cultivos estratégicos nacionales.
*/
    public getAllProfiles = async (req: Request, res: Response): Promise<void> => {
        try {
            const profiles = CropProfileService.getAllProfiles();
            res.status(200).json(ok(profiles,"Crop profiles loaded succesfully"));
        } catch (error: any) {
            res.status(200).json(fail(error?.message || "Failed to load crop profiles"));
        }
    };
}