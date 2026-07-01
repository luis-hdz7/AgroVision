import { Request, Response } from "express";
import { CropProfileService } from "../services/cropProfileService";
import { ok, fail } from "../../../shared/responses/apiResponses";
import { CropType } from "../types/cropProfileTypes";


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
    /**
     * Controlador para obtener un perfil de cultivo específico por su tipo.
     */

    public getProfileByType = async (req: Request, res: Response): Promise<void> => {
        try {
            const {type} = req.params;
            // 1. Validar que 'type' sea un string y no un arreglo
            if (typeof type !== 'string') {
                res.status(400).json(fail("Invalid crop type parameter"));
                return;
            }
            //Convertir el string al tipo CropType (Casting)
            const cropType = type.toUpperCase() as CropType;
            //Llamar al servicio de forma segura
            const profile = CropProfileService.getProfileByType(cropType);

            if (!profile) {
                res.status(404).json(fail(`Crop profile with type ${cropType} not found`));
                return;
            }
            res.status(200).json(ok(profile, `Crop profile for ${cropType} loaded successfully`));
        } catch (error: any) {
            res.status(500).json(fail(error?.message || "Failed to load crop profile"));
        }
    }
}

