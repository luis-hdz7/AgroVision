import { Request, Response } from "express";
import { FieldService } from "../services/fieldService";
import { ok, fail } from "../../../shared/responses/apiResponses";

export class FieldController {
    
    private fieldService = new FieldService();

    public getFields = async (req: Request, res: Response): Promise<void> => {
        try {
            const fields = await this.fieldService.getFields();
            res.status(200).json(ok(fields, "Fields loaded successfully"));
        } catch (error) {
            res.status(500).json(fail("Failed to load fields"))
        }
    }
}