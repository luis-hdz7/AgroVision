import type { Request, Response } from "express";
import { ZodError } from "zod";
import { classifyRegistrationError } from "../../../shared/errors/registrationErrors";
import { CropService } from "../services/cropService";
import { createCropSchema, updateCropSchema, cropIdParamSchema, fieldIdParamSchema } from "../schemas/cropSchemas";
import { ok, fail } from "../../../shared/responses/apiResponses";

function respondError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json(fail("Parámetros o datos de cultivo inválidos."));
    return;
  }

  const result = classifyRegistrationError(
    error,
    "Cultivo no encontrado.",
    "No fue posible procesar la solicitud de cultivo.",
  );
  res.status(result.status).json(fail(result.message));
}

export class CropController {
  private readonly cropService = new CropService();

  public getCrops = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(ok(await this.cropService.getCrops(), "Crop cycles loaded successfully"));
    } catch (error: unknown) { respondError(res, error); }
  };

  public getCropById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = cropIdParamSchema.parse(req.params);
      const crop = await this.cropService.getCropById(id);
      if (!crop) {
        res.status(404).json(fail(`Crop with ID ${id} not found`));
        return;
      }
      res.status(200).json(ok(crop, "Crop loaded successfully"));
    } catch (error: unknown) { respondError(res, error); }
  };

  public getCropsByFieldId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fieldId } = fieldIdParamSchema.parse(req.params);
      const crops = await this.cropService.getCropsByFieldId(fieldId);
      res.status(200).json(ok(crops, "Field crop cycles loaded successfully"));
    } catch (error: unknown) { respondError(res, error); }
  };

  public createCrop = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = createCropSchema.parse(req.body);
      const crop = await this.cropService.createCrop(input);
      res.status(201).json(ok(crop, "Crop created successfully"));
    } catch (error: unknown) { respondError(res, error); }
  };

  public updateCrop = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = cropIdParamSchema.parse(req.params);
      const input = updateCropSchema.parse(req.body);
      const crop = await this.cropService.updateCrop(id, input);
      res.status(200).json(ok(crop, "Crop updated successfully"));
    } catch (error: unknown) { respondError(res, error); }
  };
}
